import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../styles/utilities';

const  windowDimension = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flex: 1,
        flexGrow: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    header: {
        color: colors.bglighter,
        textAlign: 'center',
        fontSize: 32,
        fontFamily: 'Montserrat-Bold',
        marginTop: 24,
        marginBottom: 44,
    },
    label: {
        fontSize: 16,
        fontFamily: 'Montserrat-Regular',
        marginBottom: 6,
        marginLeft: 8,
        color: colors.bglighter,
    },
    authInput: {
        color: colors.offWhite,
        fontFamily: 'Montserrat-Regular',
        height: 48,
        borderRadius: 24,
        borderWidth: 0.5,
        borderColor: colors.offWhite,
        backgroundColor: '#2E2C2F20',
        padding: 16,
        marginBottom: 14,
    },
    promptText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Montserrat-Regular',
        marginTop: 10,
        textAlign: 'center',
    },
    promptLink: {
        color: colors.primary,
        textDecorationLine: 'underline',
    },
    welcomeLogo: {
        width: 140,
        height: 140,
        alignSelf: 'center',
    },
    topInnerContainer: {
        flex: 1,
        marginTop: 128,
    },
    bottomInnerContainer: {
        marginTop: 'auto',
        marginBottom: 64,
    },
    userTypeText: {
        fontSize: 24,
        paddingRight: 12,
        color: colors.white,
        fontFamily: 'Montserrat-Regular',
        alignSelf: 'center',
    },

    userTypePrompt: {
        marginTop: -24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    userTypePicker: {
        width: 200,
        alignSelf: 'center',
    },

    pickerItem: {
        fontSize: 24,
        fontWeight: 'bold',
    },

    userInfoContainer: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 80,
        backgroundColor: colors.bgDark,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 16,
        gap: 16,
    },

    userInfoHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },

    headerProfile: {
        color: 'white',
        fontSize: 24,
        fontFamily: 'Montserrat-Bold',
        textAlign: 'left',
    },
    addPhotoPrompt: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    addPhotoText: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'Montserrat-Bold',
    },
    inputTextProfile: {
        color: 'white',
        fontSize: 14,
        fontFamily: 'Montserrat-Bold',
        textAlign: 'left',
    },
    genresContainer: {
        marginTop: 16,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 10,
    },
    errorText: {
        color: colors.primary,
        fontSize: 16,
        fontFamily:'Montserrat-Regular',
        textAlign: 'center',
        marginBottom: 10,
    },
    imageBackground: {
        position: 'absolute',
        flex:1,
        bottom:0,
        right:0,
        width: windowDimension.width,
        height: windowDimension.height * 1.065,
    },
});
