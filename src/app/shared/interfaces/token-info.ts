import { Storage } from '../utils/storage';

export interface TokenInfo {
  token: string | null;
  source: Storage.LOCAL_STORAGE | Storage.SESSION_STORAGE | Storage.NONE;
}
