interface ButtonStyle {
  color: string;
  backgroundColor: string;
  top: string;
  left: string;
  width: string;
  height: string;
  borderRadius: string;
  fontSize: string;
}

interface ButtonConfig {
  buttonText: string;
  buttonStyle: ButtonStyle;
}

export const buttonConfig: ButtonConfig = {
  buttonText: 'Start Game ',
  buttonStyle: {
    color: '#FFFFFF',
    backgroundColor: '#A953FF',
    top: '75%',
    left: '50%',
    width: '70%',
    height: '48px',
    borderRadius: '8px',
    fontSize: '24px',
  }
}
