import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { EmailProvider } from './src/EmailContext';
import StackNavigation from './src/navigation/StackNavigation';
import FolderNavigation from './src/screens/Home/documents/FolderNavigation';

// import PDFView from './src/screens/Home/PDFView';
// import FileDownload from './src/screens/Home/fileDownload';
// import DocumentIPFS from './src/screens/Home/DocumentIPFS';
// import Documents from './src/screens/Home/documents/Documents';

export default function App() {
  return (
    <EmailProvider>
      <NavigationContainer>
        {/* <StackNavigation /> */}
        <FolderNavigation />
      </NavigationContainer>
    </EmailProvider>
    // <DocumentIPFS />
    // <FileDownloader />
    // <Documents /> 
    // <PDFView />
    // <FileDownload />
  );
}
