import { AccessMode, IAccessRights } from '@src/models/i-access-rights';

export function hasAccessRights(
  accessRightsList: IAccessRights | undefined,
  userId: string,
  accessMode: AccessMode,
): boolean {
  const accessEntry = accessRightsList[userId];
  if (!accessEntry || !accessRightsList) {
    return false;
  }
  return accessEntry >= accessMode;
}
