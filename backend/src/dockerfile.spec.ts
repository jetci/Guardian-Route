import * as fs from 'fs';
import * as path from 'path';

describe('Backend Dockerfile', () => {
  it('exists and runs prisma generate', () => {
    const dockerfilePath = path.join(process.cwd(), 'Dockerfile');
    expect(fs.existsSync(dockerfilePath)).toBe(true);
    const content = fs.readFileSync(dockerfilePath, 'utf8');
    expect(/prisma generate|npx prisma generate/.test(content)).toBe(true);
  });
});
