import { Injectable, OnModuleInit } from '@nestjs/common';
import { initWasm } from '@trustwallet/wallet-core';
import type { WalletCore } from '@trustwallet/wallet-core';

type HDWalletInstance = InstanceType<WalletCore['HDWallet']>;

/**
 * Provides access to wallet-core WASM initialization and helpers.
 */
@Injectable()
export class WalletCoreAdapter implements OnModuleInit {
  private core: WalletCore | null = null;
  private corePromise: Promise<WalletCore> | null = null;

  /**
   * Initializes wallet-core on module startup.
   * @returns Promise that resolves when core is loaded.
   */
  async onModuleInit(): Promise<void> {
    this.core = await this.loadCore();
  }

  /**
   * Returns the initialized wallet-core instance.
   * @returns Wallet-core instance.
   */
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

  /**
   * Creates an HD wallet with random mnemonic.
   * @param strength Mnemonic strength in bits.
   * @param passphrase Optional passphrase.
   * @returns HD wallet instance.
   */
  createHDWallet(strength: number, passphrase: string): HDWalletInstance {
    return this.getCore().HDWallet.create(strength, passphrase);
  }

  /**
   * Creates an HD wallet from a mnemonic phrase.
   * @param mnemonic BIP39 mnemonic phrase.
   * @param passphrase Optional passphrase.
   * @returns HD wallet instance.
   */
  createHDWalletWithMnemonic(
    mnemonic: string,
    passphrase: string,
  ): HDWalletInstance {
    return this.getCore().HDWallet.createWithMnemonic(mnemonic, passphrase);
  }

  /**
   * Checks whether a mnemonic phrase is valid.
   * @param mnemonic BIP39 mnemonic phrase.
   * @returns True when mnemonic is valid.
   */
  isMnemonicValid(mnemonic: string): boolean {
    return this.getCore().Mnemonic.isValid(mnemonic);
  }
}
