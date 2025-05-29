import * as migration_20250529_024145_initial from './20250529_024145_initial';
import * as migration_20250529_103541_media_uploads from './20250529_103541_media_uploads';

export const migrations = [
  {
    up: migration_20250529_024145_initial.up,
    down: migration_20250529_024145_initial.down,
    name: '20250529_024145_initial',
  },
  {
    up: migration_20250529_103541_media_uploads.up,
    down: migration_20250529_103541_media_uploads.down,
    name: '20250529_103541_media_uploads'
  },
];
