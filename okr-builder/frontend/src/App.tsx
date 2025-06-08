import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CopilotKit } from '@copilotkit/react-core';
import { CopilotSidebar } from '@copilotkit/react-ui';
import { OKRBuilder } from './components';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CopilotKit  runtimeUrl="http://localhost:4000/api/copilotkit">
        <CopilotSidebar instructions={`
        You are an expert OKR strategist. Your goal is to help users draft Objectives and Key Results (OKRs).
        When a user asks you to generate an OKR, you must immediately create a complete, specific, and ambitious draft based on their request.
        **Crucially, do not ask for more details or clarifying questions.** Make reasonable assumptions to generate a full OKR, including one clear Objective and at least four measurable Key Results.
        It's VITAL and IMORTANT that after the creation/update/deletion of an Objective or Key Result, you call the tool to update the state of the OKR. Imagine you are Jarvis from Iron Man,
        who is always updating the state of the OKR, to provide the latest information to the user in a user friendly way.
        Present your draft as a starting point for collaboration. Encourage the user to provide feedback and refine the OKR until they are completely satisfied.`}>
          <OKRBuilder />
        </CopilotSidebar>
      </CopilotKit>
    </ThemeProvider>
  );
}

export default App;
