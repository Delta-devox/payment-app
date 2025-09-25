import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation, useIsFocused } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const SCAN_SIZE = width * 0.7;

export default function QrScannerScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const scanAnim = useRef(new Animated.Value(0)).current;


  const startAnimation = () => {
    scanAnim.setValue(0);
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, {
          toValue: SCAN_SIZE,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    if (isFocused) {
      setScanned(false);
      startAnimation();
    }
  }, [isFocused]);

  // Handle QR code scan
  const handleBarcodeScanned = ({ type, data }) => {
    setScanned(true);
    try {
      let upiId = '';
      let name = '';
      let params;

      if (data.includes('?')) {
        const query = data.split('?')[1];
        params = new URLSearchParams(query);
        upiId = params.get('pa') || '';
        name = params.get('pn') || '';
      }

      if (!name && params) {
        name = params.get('mc') || params.get('cu') || 'Recipient';
      }

      if (!upiId) {
        alert('Invalid QR code. Missing UPI ID');
        return;
      }

      const scannedData = { name, upiId };
      navigation.navigate('Amount', { scannedData });
    } catch (error) {
      alert('Failed to parse QR code. Please try again.');
      console.error(error);
    }
  };

  // Refresh scan
  const handleRefresh = () => {
    setScanned(false);
    startAnimation();
  };

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <Text style={styles.permissionText}>
          We need your permission to use the camera.
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!isFocused) return null;

  return (
    <SafeAreaView style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={'back'}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
      />

      {/* Overlay & Scan Box */}
      <View style={styles.overlay}>
        <View style={styles.unfocusedArea} />
        <View style={styles.middleRow}>
          <View style={styles.unfocusedArea} />
          <View style={styles.scanBox}>
            <Animated.View
              style={[styles.scanLine, { transform: [{ translateY: scanAnim }] }]}
            />
          </View>
          <View style={styles.unfocusedArea} />
        </View>
        <View style={styles.unfocusedArea} />
      </View>

      <Text style={styles.hintText}>Place the QR code inside the box</Text>

      {/* Refresh Button */}
      {scanned && (
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
          <Text style={styles.refreshText}>↻ Scan Again</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

// --- Styles ---
const overlayColor = 'rgba(0,0,0,0.6)';
const borderColor = '#16A34A';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  camera: { ...StyleSheet.absoluteFillObject },
  overlay: { ...StyleSheet.absoluteFillObject },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  permissionText: { color: 'white', fontSize: 18, textAlign: 'center', margin: 20 },
  button: {
    backgroundColor: borderColor,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  hintText: {
    position: 'absolute',
    bottom: 120,
    width: '100%',
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
  },
  unfocusedArea: { flex: 1, backgroundColor: overlayColor },
  middleRow: { flexDirection: 'row' },
  scanBox: {
    width: SCAN_SIZE,
    height: SCAN_SIZE,
    borderWidth: 2,
    borderColor: borderColor,
    borderRadius: 12,
    overflow: 'hidden',
  },
  scanLine: {
    width: '100%',
    height: 2,
    backgroundColor: 'white',
    shadowColor: 'white',
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 10,
  },
  refreshButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: borderColor,
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  refreshText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});
