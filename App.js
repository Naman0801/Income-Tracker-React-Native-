import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Button, SafeAreaView, Dimensions, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { LineChart } from "react-native-chart-kit";

export default function App() {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [labels, setLabels] = useState('');
  const [data, setData] = useState([
    {[new Date()]: 200},
    {[new Date() - 1]: 500},
  ]);
  const [total, setTotal] = useState(0);
  const [gigs, setGigs] = useState([
    {
      description: 'Freelance job',
      amount: 1000,
      date: new Date(),
    }
  ]);

  console.log('debug', data);

  useEffect(() => {
    setTotal(gigs.reduce((total, gig) => total + Number(gig.amount), 0));
  }, [gigs])

  const addGig = () => {
    setGigs([...gigs, {
      description: description,
      amount: amount, 
      date: new Date()
    }])

    setDescription(''),
    setAmount('')
  }

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text>Bezier Line Chart</Text>
        <LineChart
          data={{
            labels: [new Date(), 'Tomorrow'],
            datasets: [
              {
                data: [
                  Math.random() * 100,
                  Math.random() * 100,
                ]
              }
            ]
          }}
          width={Dimensions.get("window").width} // from react-native
          height={220}
          yAxisLabel="$"
          // yAxisSuffix="k"
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={{
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#141e30",
            backgroundGradientTo: "#243b55",
            decimalPlaces: null, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#ffa726"
            }
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
        />
      </View>
      <View>
        <Text style={{marginBottom: 10}}>Total Income {total}</Text>
      </View>
      <TextInput 
        style={styles.input}
        value={description}
        placeholder='Enter the Gig description'
        onChangeText={text => setDescription(text)}
      />
      <TextInput 
        style={styles.input}
        value={amount}
        placeholder='Enter the amount you made in $'
        keyboardType='numeric'
        onChangeText={text => setAmount(text)}
      />
      <Button disabled={!amount || !description} title='Add Gig' onPress={addGig}/>

      {gigs.map((gig, index) => (
        <View key={index}>
          <Text>{gig.description}</Text>
          <Text>${gig.amount}</Text>
        </View>
      ))}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30
  },  
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: 'red',
    width: '90%',
    marginBottom: '5%',
    marginLeft: '5%',
    padding: 20,
    height: 60
  },
});
