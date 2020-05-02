import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

export default async function logCurrentStorage(): Promise<Product[]> {
  const myStorage: Product[] = [];

  await AsyncStorage.getAllKeys().then(async keyArray => {
    await AsyncStorage.multiGet(keyArray).then(keyValArray => {
      // eslint-disable-next-line no-restricted-syntax
      for (const keyVal of keyValArray) {
        // eslint-disable-next-line prefer-destructuring

        myStorage.push(JSON.parse(keyVal[1] || ''));
      }
    });
  });

  return myStorage;
}
