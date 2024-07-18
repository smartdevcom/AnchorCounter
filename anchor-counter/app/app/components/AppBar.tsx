import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Image from 'next/image';

export const AppBar = () => {
  return (
    <div>
      <Image alt='appbar' height={30} src='/solanaLogo.png' width={200} />
      <span>Anchor Frontend Example</span>
      <WalletMultiButton />
    </div>
  );
};
