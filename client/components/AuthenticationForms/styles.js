import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    header: {
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
    },
    input: {
        height: 48,
        borderRadius: 24,
        borderWidth: 0.5,
        borderColor: '#212529',
        padding: 16,
        marginBottom: 14,
    },
    primaryBtn: {
        height: 48,
        borderRadius: 24,
        backgroundColor: '#212529',
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryBtnText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    promptText: {
        fontSize: 16,
        marginTop: 10,
        textAlign: 'center',
    },
    promptLink: {
        color: 'blue',
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
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    userTypePrompt: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    userTypePicker: {
        fontSize: 24,
        width: 200,
        alignSelf: 'center',
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
