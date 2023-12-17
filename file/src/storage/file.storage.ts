import { randomUUID } from 'node:crypto';
import fs, { createReadStream } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { Injectable } from '@nestjs/common';
import { IEntityTree } from '@src/models/i-entity-tree';
import JSZip from 'jszip';
import storageConfig from '../../storage-config.json';
import { EntityStorage } from './entity.storage';

const fileSystem = fs.promises;

export const storageFolderRoot = storageConfig['storageFolderRoot'];

function constructPath(name: string): string {
  return path.join(__dirname, storageFolderRoot, name);
}

@Injectable()
export class FileStorage {
  public constructor(private entityStorage: EntityStorage) {}

  public async createFile(id: string, contents?: Buffer): Promise<void> {
    const constructedPath = constructPath(id);

    fs.stat(constructedPath, async function (err) {
      if (err == null) {
        throw new Error('File exists');
      } else if (err.code === 'ENOENT') {
        return fileSystem.writeFile(constructedPath, contents);
      } else {
        throw new Error('Internal error on creating file');
      }
    });
  }

  public async getFileProperty(id: string): Promise<Record<string, unknown>> {
    const constructedPath = constructPath(id);
    const stats = await fileSystem.stat(constructedPath);
    return JSON.parse(JSON.stringify(stats));
  }

  public async deleteFiles(ids: string[]): Promise<void> {
    const constructedPaths: Record<string, string> = {};
    for (const id of ids) {
      constructedPaths[id] = constructPath(id);
    }

    for (const [constructedPath] of Object.entries(constructedPaths)) {
      await fileSystem.unlink(constructedPath);
    }
  }

  public getFile(id: string): fs.ReadStream {
    const filePath = constructPath(id);

    return createReadStream(filePath);
  }

  public async getFiles(ids: string[]): Promise<fs.ReadStream> {
    const name = 'download.zip';
    const zip = new JSZip();

    const temp = await this.makeTempFolder();
    const path = `${temp}/${name}`;

    await Promise.all(
      ids.map(async (id) => {
        const entity = await this.entityStorage.getVirtualEntity(id);
        if (entity.isFile) {
          const fileData = await this.getFileContent(entity.id);
          zip.file(`${storageFolderRoot}/${entity.id}`, fileData);
        } else {
          const entityTree =
            await this.entityStorage.getVirtualEntityChildrenRecursive(id);
          await this.zipEntityTree(entityTree, zip);
        }
      }),
    );

    return new Promise((resolve, reject) => {
      zip
        .generateNodeStream({ type: 'nodebuffer', streamFiles: true })
        .pipe(fs.createWriteStream(path))
        .on('finish', () => {
          resolve(createReadStream(path));
        })
        .on('error', () => {
          reject('Error while writing ZIP');
        });
    });
  }

  public getFileContent(id: string): Promise<Buffer> {
    return fs.promises.readFile(constructPath(id));
  }

  public async getFolder(id: string): Promise<fs.ReadStream> {
    const name = 'download.zip';
    const zip = new JSZip();

    const entityTree =
      await this.entityStorage.getVirtualEntityChildrenRecursive(id);
    await this.zipEntityTree(entityTree, zip);

    const temp = await this.makeTempFolder();
    const path = `${temp}/${name}`;

    return new Promise((resolve, reject) => {
      zip
        .generateNodeStream({ type: 'nodebuffer', streamFiles: true })
        .pipe(fs.createWriteStream(path))
        .on('finish', () => {
          resolve(createReadStream(path));
        })
        .on('error', () => {
          reject('Error while writing ZIP');
        });
    });
  }

  private async zipEntityTree(
    tree: IEntityTree,
    jszip: JSZip,
    parentPath?: string,
  ): Promise<void> {
    if (tree.children && tree.children.length > 0) {
      await Promise.all(
        tree.children.map(async (child) => {
          await this.zipEntityTree(
            child,
            jszip,
            `${parentPath}/${child.entity.id}`,
          );
        }),
      );
    } else {
      const fileData = await this.getFileContent(tree.entity.id);
      jszip.file(`${parentPath}/${tree.entity.id}`, fileData);
    }
  }

  private async makeTempFolder(): Promise<string> {
    const id = randomUUID();
    const directory = path.join(os.tmpdir(), id);

    await fs.promises.mkdir(directory);
    return directory;
  }
}
