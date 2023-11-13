import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Image, View } from 'react-native';
import Typewriter from 'react-native-typewriter';
import axios from 'axios'; // Import Axios

export default function Recommender() {
  const [handle, setHandle] = useState('');
  const [loading, setLoading] = useState(false);
  const [blurb, setBlurb] = useState('');
  const [typedMessages, setTypedMessages] = useState([]);

  const messages = [
    "Analyzing your followers' taste...",
    "Crafting personalized recommendations...",
    "Finalizing tips for your handle..."
  ];

  const [apiBlurb, setApiBlurb] = useState(''); // New state for API response

  const handleGenerate = () => {
    setLoading(true);
    setBlurb('');
    setTypedMessages([]);
    setApiBlurb(''); // Reset API blurb state

    axios.get(`http://localhost:2020/api/v1/instagram/handle?handle=${handle}`)
      .then(response => {
        setApiBlurb(response.data.result._id); // Store API response in state
      })
      .catch(error => {
        setBlurb("Account Not Found")
        console.error('Error:', error);
        setLoading(false);
      });
  };

  const onTypingEnd = () => {
    const nextIndex = typedMessages.length;
    if (nextIndex < messages.length - 1) {
      setTypedMessages(currentTypedMessages => [...currentTypedMessages, messages[nextIndex]]);
      console.log("here")
    } else if (nextIndex === messages.length - 1) {
      setLoading(false);
      setBlurb(apiBlurb || `It's recommended to focus on lifestyle content with a blend of travel and fashion. Engaging with followers through stories and regular posts about daily activities would be beneficial.`);
      console.log("blurb")
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <Image
        style={styles.logo}
        source={require('/Users/anindyasharma/Desktop/vlogmi/creator/creator-studio/components/Recommender/logp.png')} // Replace with your local logo image path
      />
      <Text style={styles.greetingText}>Hey, {handle || 'there!'}</Text>
      <TextInput
        style={styles.input}
        onChangeText={text => setHandle(text)}
        value={handle}
        placeholder="Enter Instagram Handle"
        placeholderTextColor="#999"
        autoCapitalize="none" 
      />
      <TouchableOpacity style={styles.button} onPress={handleGenerate}>
        {loading ? (
          <ActivityIndicator size="small" color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>Let's go!</Text>
        )}
      </TouchableOpacity>

      {!blurb && (
      <View>
        {typedMessages.map((msg, index) => (
          <Text key={index} style={styles.typingText}>{msg}</Text>
        ))}

        {loading && typedMessages.length < messages.length && (
          <Typewriter
            typing={1}
            onTypingEnd={onTypingEnd}
            style={styles.typingText}
          >
            {messages[typedMessages.length]}
          </Typewriter>
        )}
      </View>
    )}

    {blurb && <Text style={styles.blurbText}>{blurb}</Text>}
  </SafeAreaView>


  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    width: '100%'
  },
  logo: {
    width: 200,
    height: 100,
    resizeMode: 'contain',
    marginTop: 20,
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    color: '#FFF',
    width: '80%',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#E1306C',
    borderRadius: 25,
    padding: 15,
    width: '80%',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  greetingText: {
    color: '#FFF',
    fontSize: 26,
    fontWeight: '600', // slightly bolder
    marginBottom: 20,
    fontFamily: 'Helvetica', // a common built-in font
  },

  typingText: {
    color: '#FFF',
    textAlign: 'center',
    paddingHorizontal: 10,
    marginBottom: 10,
    fontFamily: 'Arial', // another standard font
    fontSize: 18,
    fontStyle: 'italic', // adds a bit of flair
  },

  blurbText: {
    color: '#FFF',
    textAlign: 'center',
    paddingHorizontal: 10,
    fontFamily: 'Verdana', // clean and readable
    fontSize: 18,
    fontWeight: '100',
  },
});
