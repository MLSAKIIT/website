import * as migration_20250529_024145_initial from './20250529_024145_initial';
import * as migration_20250529_103541_media_uploads from './20250529_103541_media_uploads';
import * as migration_20250530_144401 from './20250530_144401';
import * as migration_20250530_160218 from './20250530_160218';
import * as migration_20250531_054649_yearbook from './20250531_054649_yearbook';
import * as migration_20250531_065436 from './20250531_065436';
import * as migration_20250531_194816 from './20250531_194816';

export const migrations = [
  {
    up: migration_20250529_024145_initial.up,
    down: migration_20250529_024145_initial.down,
    name: '20250529_024145_initial',
  },
  {
    up: migration_20250529_103541_media_uploads.up,
    down: migration_20250529_103541_media_uploads.down,
    name: '20250529_103541_media_uploads',
  },
  {
    up: migration_20250530_144401.up,
    down: migration_20250530_144401.down,
    name: '20250530_144401',
  },
  {
    up: migration_20250530_160218.up,
    down: migration_20250530_160218.down,
    name: '20250530_160218',
  },
  {
    up: migration_20250531_054649_yearbook.up,
    down: migration_20250531_054649_yearbook.down,
    name: '20250531_054649_yearbook',
  },
  {
    up: migration_20250531_065436.up,
    down: migration_20250531_065436.down,
    name: '20250531_065436',
  },
  {
    up: migration_20250531_194816.up,
    down: migration_20250531_194816.down,
    name: '20250531_194816'
  },
];
