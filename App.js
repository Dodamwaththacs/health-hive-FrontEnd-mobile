import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { EmailProvider } from './src/EmailContext';
import StackNavigation from './src/navigation/StackNavigation';
// import PDFView from './src/screens/Home/PDFView';
import FileDownload from './src/screens/Home/fileDownload';
import DocumentIPFS from './src/screens/Home/DocumentIPFS';

export default function App() {
  return (
    // <EmailProvider>
    //   <NavigationContainer>
    //     <StackNavigation />
    //   </NavigationContainer>
    // </EmailProvider>
    <DocumentIPFS />
    // <FileDownloader />
    //<Documents /> 
    // <PDFView />
    // <FileDownload />
  );
}
