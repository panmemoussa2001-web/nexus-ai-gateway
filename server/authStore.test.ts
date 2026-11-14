import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  LocalAuthStore,
  hashPassword,
  signSessionToken,
  verifyPassword,
  verifySessionToken,
} from './authStore.ts';

function createTempStore(): { store: LocalAuthStore; cleanup: () => void } {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'nexus-auth-test-'));
  const filePath = path.join(dir, 'db.json');
  return {
    store: new LocalAuthStore(filePath),
    cleanup: () => fs.rmSync(dir, { recursive: true, force: true }),
  };
}

test('scrypt password hashing verifies valid passwords and rejects invalid ones', () => {
  const hash = hashPassword('Str0ngPassw0rd!');
  assert.equal(verifyPassword('Str0ngPassw0rd!', hash), true);
  assert.equal(verifyPassword('WrongPassword', hash), false);
});

test('HMAC session token signs, verifies, and rejects tampered tokens', () => {
  const secret = 'test-session-secret-key-123456';
  const token = signSessionToken('NX-USR-1234', secret, 3600);
  assert.equal(verifySessionToken(token, secret), 'NX-USR-1234');
  assert.equal(verifySessionToken(`${token}x`, secret), null);
  assert.equal(verifySessionToken(token, 'wrong-secret'), null);
});

test('LocalAuthStore registers users, prevents duplicate emails, and isolates workspaces', () => {
  const { store, cleanup } = createTempStore();
  try {
    const regA = store.registerUser({
      fullName: 'Adama Watt',
      email: 'adama@nexus.example',
      organization: 'NEXUS',
      password: 'Password123!',
    });
    assert.equal(regA.ok, true);
    if (!regA.ok) return;

    const dup = store.registerUser({
      fullName: 'Adama Duplicate',
      email: 'ADAMA@nexus.example',
      password: 'Password123!',
    });
    assert.equal(dup.ok, false);
    if (!dup.ok) assert.equal(dup.status, 409);

    const regB = store.registerUser({
      fullName: 'Second User',
      email: 'second@nexus.example',
      password: 'Password456!',
    });
    assert.equal(regB.ok, true);
    if (!regB.ok) return;

    const authOk = store.authenticateUser({
      email: 'adama@nexus.example',
      password: 'Password123!',
    });
    assert.equal(authOk.ok, true);

    const authBad = store.authenticateUser({
      email: 'adama@nexus.example',
      password: 'WrongPassword!',
    });
    assert.equal(authBad.ok, false);

    // Verify User A workspace changes do not leak to User B
    const wsA = store.getWorkspace(regA.user.id)!;
    store.saveWorkspace(regA.user.id, {
      ...wsA,
      agents: [
        {
          id: 'NX-AGT-001',
          name: 'Private Agent A',
          purpose: 'Handles User A workflows only.',
          category: 'Finance',
          status: 'enabled',
          createdAt: '2026-11-13T10:00:00.000Z',
        },
      ],
    });

    const reloadedA = store.getWorkspace(regA.user.id)!;
    const reloadedB = store.getWorkspace(regB.user.id)!;
    assert.equal(reloadedA.agents.length, 1);
    assert.equal(reloadedA.agents[0].name, 'Private Agent A');
    assert.equal(reloadedB.agents.length, 0);
  } finally {
    cleanup();
  }
});
