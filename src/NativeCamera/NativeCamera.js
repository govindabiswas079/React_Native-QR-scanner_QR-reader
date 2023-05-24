import React, { Fragment, useState } from 'react'
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Linking,
    Dimensions,
    StatusBar,
    Alert,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import RNQRGenerator from 'rn-qr-generator';
import jpeg from 'jpeg-js';
import { Buffer } from 'buffer';
import jsQR from 'jsqr';
const PNG = require('pngjs/browser').PNG;

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

console.disableYellowBox = true;

import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

const NativeCamera = () => {
    const [isFlash, setIsFlash] = useState(false);
    const [isCamera, setIsCamera] = useState(false);

    const onSuccess = e => {
        Linking.openURL(e.data).catch(err =>
            console.error('An error occured', err)
        );
    };


    const readQRFromGallery = () => {
        launchImageLibrary({ selectionLimit: 1, mediaType: 'photo', includeBase64: true, }, ({ didCancel, assets, errorCode }) => {
            if (didCancel || errorCode || !assets || assets.length === 0) {
                console.log(didCancel, assets, errorCode)
                return;
            }
            const image = assets[0];
            const base64Buffer = Buffer.from(image.base64, 'base64');

            let pixelData;
            let imageBuffer;
            // const base64Buffer = Buffer.from(image?.base64, 'base64');

            /* RNQRGenerator.detect({ uri: image?.uri,  base64: 'data:image/jpeg,base64,'+image?.base64,})
                .then(response => {
                    const { values } = response;
                    console.log(response)
                })
                .catch(error => console.log('Cannot detect QR code in image', error)); */

            // Handle decoding based on different mimetypes
            if (image.type === 'image/jpeg') {
                pixelData = jpeg.decode(base64Buffer, { useTArray: true }); // --> useTArray makes jpeg-js work on react-native without needing to nodeify it
                imageBuffer = pixelData.data;
                console.log('click2')
            } else if (image.type === 'image/png') {
                pixelData = PNG.sync.read(base64Buffer);
                imageBuffer = pixelData.data;
                console.log('click1')
            } else {
                // you can alert the user here that the format is not supported
                console.log('click')
                return;
            }
            
            const data = Uint8ClampedArray.from(imageBuffer);
            
            const code = jsQR(data, image.width, image.height);
            Alert.alert('Success',code?.data)

        });
    };

    return (
        <Fragment>
            <StatusBar translucent={true} backgroundColor={'transparent'} />
            <View style={{ flex: 1, backgroundColor: 'red' }}>
                {/* <QRCodeScanner
                    showMarker={true}
                    cameraStyle={{ height: Dimensions.get('screen').height, width: Dimensions.get('screen').width }}
                    cameraType={isCamera ? 'front' : 'back'}
                    onRead={(data) =>{ Alert.alert('Success', data?.data); console.log(data)}}
                    flashMode={!isFlash ? RNCamera.Constants.FlashMode.off : RNCamera.Constants.FlashMode.torch}

                    customMarker={ // https://github.com/moaazsidat/react-native-qrcode-scanner/issues/115
                        <View style={styles.rectangleContainer}>
                            <View style={styles.topOverlay} />

                            <View style={{ flexDirection: "row" }}>
                                <View style={styles.leftAndRightOverlay} />

                                <View style={styles.rectangle}>

                                </View>

                                <View style={styles.leftAndRightOverlay} />
                            </View>

                            <View style={styles.bottomOverlay} />
                        </View>
                    }
                /> */}

                <View style={{ width: '100%', flexDirection: 'row', position: 'absolute', justifyContent: 'center', alignItems: 'center', bottom: 50, zIndex: 999 }}>
                    <TouchableOpacity onPress={() => setIsFlash(prev => !prev)} style={{ width: 50, height: 50, alignItems: 'center', justifyContent: 'center', elevation: 12, backgroundColor: '#FFFFFF', borderRadius: 50 }}>
                        <Text style={{ fontSize: 20, fontWeight: '700', color: '#000000' }}>F</Text>
                    </TouchableOpacity>
                    <View style={{ width: 15, backgroundColor: 'transparent', }}></View>
                    <TouchableOpacity onPress={() => setIsCamera(prev => !prev)} style={{ width: 50, height: 50, alignItems: 'center', justifyContent: 'center', elevation: 12, backgroundColor: '#FFFFFF', borderRadius: 50 }}>
                        <Text style={{ fontSize: 20, fontWeight: '700', color: '#000000' }}>C</Text>
                    </TouchableOpacity>
                    <View style={{ width: 15, backgroundColor: 'transparent', }}></View>
                    <TouchableOpacity onPress={() => readQRFromGallery()} style={{ width: 50, height: 50, alignItems: 'center', justifyContent: 'center', elevation: 12, backgroundColor: '#FFFFFF', borderRadius: 50 }}>
                        <Text style={{ fontSize: 20, fontWeight: '700', color: '#000000' }}>I</Text>
                    </TouchableOpacity>
                    <View style={{ width: 15, backgroundColor: 'transparent', }}></View>
                    <TouchableOpacity onPress={() => {
                        Linking.openURL("upi://pay?pa=govindbiswas079-2@okaxis&pn=Govinda%20Biswas&aid=uGICAgICDyJGZHg")
                    }} style={{ width: 50, height: 50, alignItems: 'center', justifyContent: 'center', elevation: 12, backgroundColor: '#FFFFFF', borderRadius: 50 }}>
                        <Text style={{ fontSize: 20, fontWeight: '700', color: '#000000' }}>P</Text>
                    </TouchableOpacity>
                </View>
            </View >
        </Fragment >
    )
}

const overlayColor = "rgba(0,0,0,0.5)"; // this gives us a black color with a 50% transparency

const rectDimensions = SCREEN_WIDTH * 0.65; // this is equivalent to 255 from a 393 device width
const rectBorderWidth = SCREEN_WIDTH * 0.005; // this is equivalent to 2 from a 393 device width
const rectBorderColor = "red";

const scanBarWidth = SCREEN_WIDTH * 0.46; // this is equivalent to 180 from a 393 device width
const scanBarHeight = SCREEN_WIDTH * 0.0025; //this is equivalent to 1 from a 393 device width
const scanBarColor = "#22ff00";

const iconScanColor = "blue";

const styles = StyleSheet.create({
    rectangleContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent"
    },

    rectangle: {
        height: rectDimensions,
        width: rectDimensions,
        borderWidth: rectBorderWidth,
        borderColor: rectBorderColor,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
        borderRadius: 5
    },

    topOverlay: {
        flex: 1,
        height: SCREEN_WIDTH,
        width: SCREEN_WIDTH,
        backgroundColor: overlayColor,
        justifyContent: "center",
        alignItems: "center"
    },

    bottomOverlay: {
        flex: 1,
        height: SCREEN_WIDTH,
        width: SCREEN_WIDTH,
        backgroundColor: overlayColor,
        paddingBottom: SCREEN_WIDTH * 0.25
    },

    leftAndRightOverlay: {
        height: SCREEN_WIDTH * 0.65,
        width: SCREEN_WIDTH,
        backgroundColor: overlayColor
    },

    scanBar: {
        width: scanBarWidth,
        height: scanBarHeight,
        backgroundColor: scanBarColor
    }
})


export default NativeCamera



/* 

<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000000' }}>
                            <View style={{ flex: 1, height: SCREEN_WIDTH, width: SCREEN_WIDTH, backgroundColor: overlayColor, justifyContent: 'center', alignItems: 'center' }} />
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ height: SCREEN_WIDTH * 0.65, width: SCREEN_WIDTH, backgroundColor: overlayColor }} />
                                <View style={{ height: reactDimensions, width: reactDimensions, borderWidth: reactBorderWidth, borderColor: reactBorderColor, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' }}>

                                </View>
                                <View style={{ height: SCREEN_WIDTH * 0.65, width: SCREEN_WIDTH, backgroundColor: overlayColor }} />
                            </View>
                            <View style={{ flex: 1, height: SCREEN_WIDTH, width: SCREEN_WIDTH, backgroundColor: overlayColor, justifyContent: 'center', alignItems: 'center' }} />
                        </View>

*/