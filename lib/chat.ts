import web3 from './web3';
import Chat from '../chat-blockchain/build/contracts/Chat.json';

const address = '0xcDA1B00420deb49b3A71EF1f603740933De6a0Ed'; // Replace with your contract address
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
