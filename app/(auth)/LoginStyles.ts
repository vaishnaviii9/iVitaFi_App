import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FEFFFF',
    padding: 16,
  },
  logo: {
    width: 91,
    height: 95,
    marginBottom: 20,
  },
  title: {
    textAlign: 'center',
    color: '#141218',
    fontSize: 24,
    fontFamily: 'Montserrat',
    fontWeight: '700',
    lineHeight: 30,
    letterSpacing: 0.20,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 60,
    backgroundColor: '#FEFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: '40%',
    transform: [{ translateY: -12 }],
    zIndex: 1,
  },
  forgotPassword: {
    textAlign: 'center',
    color: '#232126',
    fontSize: 15,
    fontFamily: 'Montserrat',
    fontWeight: '400',
    lineHeight: 30,
    letterSpacing: 0.20,
    marginBottom: 20,
  },
  loginButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#1F3644',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'Montserrat',
    fontWeight: '700',
    lineHeight: 30,
    letterSpacing: 0.20,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  footerText: {
    textAlign: 'center',
    color: '#151616',
    fontSize: 15,
    fontFamily: 'Montserrat',
    fontWeight: '700',
    lineHeight: 30,
    letterSpacing: 0.20,
  },
  poweredBy: {
    textAlign: 'center',
    color: 'black',
    fontSize: 15,
    fontFamily: 'Montserrat',
    fontWeight: '400',
    lineHeight: 30,
    letterSpacing: 0.20,
    marginBottom: 10,
  },
  poweredByLogo: {
    width: 102,
    height: 37,
  },
  errorText:{
    color: '#FF0000',
  
  }
});

export default styles;
