import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export const AppBar = () => {
  return (
    <div>
      <span>Anchor Frontend Example</span>
      <WalletMultiButton />
    </div>
  );
};
