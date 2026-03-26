import { createTheme } from '@mui/material/styles';

export const getAppTheme = (mode) => {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: isDark ? '#7dd3fc' : '#2563eb'
      },
      secondary: {
        main: isDark ? '#f472b6' : '#ec4899'
      },
      background: {
        default: isDark ? '#07111f' : '#f6f8fc',
        paper: isDark ? 'rgba(13, 24, 43, 0.88)' : 'rgba(255, 255, 255, 0.82)'
      },
      success: {
        main: '#10b981'
      },
      warning: {
        main: '#f59e0b'
      },
      error: {
        main: '#f43f5e'
      }
    },
    shape: {
      borderRadius: 20
    },
    typography: {
      fontFamily: 'Poppins, Segoe UI, sans-serif',
      h1: {
        fontWeight: 700,
        letterSpacing: '-0.04em'
      },
      h3: {
        fontWeight: 700,
        letterSpacing: '-0.03em'
      },
      button: {
        textTransform: 'none',
        fontWeight: 600
      }
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            transition: 'background 0.25s ease, color 0.25s ease'
          }
        }
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(148, 163, 184, 0.18)',
            boxShadow: isDark
              ? '0 24px 60px rgba(2, 8, 23, 0.45)'
              : '0 24px 60px rgba(15, 23, 42, 0.08)'
          }
        }
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backdropFilter: 'blur(16px)'
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            paddingInline: 18,
            paddingBlock: 12
          }
        }
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 600,
            borderRadius: 999
          }
        }
      },
      MuiTextField: {
        defaultProps: {
          variant: 'outlined',
          size: 'medium'
        }
      }
    }
  });
};
