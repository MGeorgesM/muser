import { StyleSheet } from 'react-native';
import { colors } from '../../styles/utilities';

export const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    scrollContainer: {
        flex:1,
        flexGrow: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    header: {
        color: 'white',
        textAlign: 'center',
        fontSize: 32,
        fontWeight: 'bold',
        marginTop: 24,
        marginBottom: 44,
    },
    label: {
        fontSize: 16,
        marginBottom: 6,
        marginLeft: 8,
        color: 'white',
    },
    input: {
        color: '#ADADAD',
        height: 48,
        borderRadius: 24,
        borderWidth: 0.5,
        borderColor: '#ADADAD',
        backgroundColor: '#2E2C2F20',
        padding: 16,
        marginBottom: 14,
    },
    promptText: {
        color: 'white',
        fontSize: 16,
        marginTop: 10,
        textAlign: 'center',
    },
    promptLink: {
        color: colors.primary,
        textDecorationLine: 'underline',
    },
    welcomeLogo: {
        width: 130,
        height: 130,
        alignSelf: 'center',
    },
    topInnerContainer: {
        marginTop: 128,
    },
    bottomInnerContainer: {
        marginBottom: 64,
    },
    userTypeText: {
        fontSize: 24,
        color: colors.primary,
        fontWeight: 'bold',
        alignSelf: 'center',
    },

    userTypePrompt: {
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
        height: '100%',
        paddingHorizontal: 20,
        marginTop: 32,
        justifyContent: 'center',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 16,
        gap: 16,
    },
    headerProfile: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'left',
    },
    addPhotoPrompt: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    addPhotoText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    inputTextProfile: {
        color: 'black',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'left',
    },
    errorText: {
        fontSize: 16,
        textAlign:'center',
        marginBottom: 10,
    },


});
