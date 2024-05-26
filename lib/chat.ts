import web3 from './web3';
import Chat from '../chat-blockchain/build/contracts/Chat.json';

const address = '0x4cA678d4E27098f8bcf233b848D2b3b995Ff8818'; // Replace with your contract address
const instance = new web3.eth.Contract(Chat.abi as any, address);


interface BlockchainMessage {
  sender: string;
  text: string;
  timestamp: number;
}

export const getMessages = async (): Promise<BlockchainMessage[]> => {
  const messages: BlockchainMessage[] = await instance.methods.getMessages().call();
  return messages;
};

export default instance;