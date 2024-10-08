import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, Button, ScrollView } from 'react-native';

export default function App() {
  const [username, setUsername] = useState<string>(''); // User's name
  const [message, setMessage] = useState<string>('');
  const [log, setLog] = useState<string[]>([]);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://192.168.1.140:3000');

    ws.current.onopen = () => {
      console.log('Connected to server');
      setLog((prev) => [...prev, 'Connected to server']);
    };

    ws.current.onmessage = (event) => {
      // Handle the received message (from other clients)
      console.log('Message from server:', event.data);
      setLog((prev) => [...prev, event.data]); // Append the message directly as received
    };

    ws.current.onclose = () => {
      setLog((prev) => [...prev, 'Disconnected from server']);
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  const sendMessage = () => {
    if (ws.current && message && username) {
      const msgData = JSON.stringify({ username, message });
      ws.current.send(msgData);
      // Append your own message to the log with "You"
      setLog((prev) => [...prev, `You (${username}): ${message}`]);
      setMessage(''); // Clear the input field after sending
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>WebSocket Client</Text>

      <ScrollView style={styles.logContainer}>
        {log.map((logItem, index) => (
          <Text key={index}>{logItem}</Text>
        ))}
      </ScrollView>

      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Type a message"
        value={message}
        onChangeText={setMessage}
      />

      <Button title="Send Message" onPress={sendMessage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
  logContainer: { flex: 1, marginTop: 10 },
  input: { borderWidth: 1, padding: 10, marginVertical: 10 },
});
