import { UUID } from './types';


export default crypto.randomUUID.bind(crypto) as () => UUID;