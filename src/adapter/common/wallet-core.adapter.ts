import { Injectable, OnModuleInit } from '@nestjs/common';
import { initWasm } from '@trustwallet/wallet-core';
import type { WalletCore } from '@trustwallet/wallet-core';

type HDWalletInstance = InstanceType<WalletCore['HDWallet']>;

@Injectable()
export class WalletCoreAdapter implements OnModuleInit {
  private core: WalletCore | null = null;
  private corePromise: Promise<WalletCore> | null = null;

  async onModuleInit(): Promise<void> {
    this.core = await this.loadCore();
  }

  getCore(): WalletCore {
    if (!this.core) {
      throw new Error('WalletCore is not initialized');
    }
    return this.core;
  }

  private async loadCore(): Promise<WalletCore> {
    if (!this.corePromise) {
      this.corePromise = initWasm();
    }
    return this.corePromise;
  }

  createHDWallet(strength: number, passphrase: string): HDWalletInstance {
    return this.getCore().HDWallet.create(strength, passphrase);
  }

  createHDWalletWithMnemonic(
    mnemonic: string,
    passphrase: string,
  ): HDWalletInstance {
    return this.getCore().HDWallet.createWithMnemonic(mnemonic, passphrase);
  }

  isMnemonicValid(mnemonic: string): boolean {
    return this.getCore().Mnemonic.isValid(mnemonic);
  }
}
