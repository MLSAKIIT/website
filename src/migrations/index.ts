import * as migration_20250528_180404_initial from './20250528_180404_initial';
import * as migration_20250528_190335_member_migrations from './20250528_190335_member_migrations';

export const migrations = [
  {
    up: migration_20250528_180404_initial.up,
    down: migration_20250528_180404_initial.down,
    name: '20250528_180404_initial',
  },
  {
    up: migration_20250528_190335_member_migrations.up,
    down: migration_20250528_190335_member_migrations.down,
    name: '20250528_190335_member_migrations'
  },
];
