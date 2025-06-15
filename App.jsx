import React, {useState} from 'react';
import Home from './screens/Home';
import Contact from './screens/Contact';


export default function App() {
 
  const [currentKey, setCurrentKey] = useState('home');

  return <Home setCurrentKey={setCurrentKey} /> 

}
