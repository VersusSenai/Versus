import { mock } from 'bun:test';

export default {
  getUserByToken: mock(() => Promise.resolve({ id: 1, role: 'U' }))
};