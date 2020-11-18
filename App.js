import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Button, SafeAreaView, Dimensions, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { LineChart } from "react-native-chart-kit";
import moment from 'moment';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [labels, setLabels] = useState('');
  const [data, setData] = useState([
    {date: moment().subtract(3, 'days').format('LL'), amount: 400},
  ]);
  const [transformedData, setTransformedData] = useState([]);
  const [total, setTotal] = useState(0);
  const [gigs, setGigs] = useState([]);

  useEffect(() => {
    setTransformedData(transformData(groupBy(data, 'date')));
    setLoading(false);
  }, [data])

  useEffect(() => {
    setTotal(gigs.reduce((total, gig) => total + Number(gig.amount), 0));
  }, [gigs])

  const getDates = () => transformedData?.map(pair => pair.date);
  const getAmounts = () => transformedData?.map(pair => pair.amount);

  const groupBy = (array, key) => array.reduce((rv, x) => {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {}); 

  const transformData = (groupedData) => {
    const transformedArray = [];

    Object.entries(groupedData).forEach(entry => {
      const total = entry[1].reduce((total, pair) => total + pair.amount, 0);
      // Changes the Date FORMAT However it is entered
      transformedArray.push({date: moment(entry[0]).format('DD/MM'), amount: total});
    });

    // Makes it in ascending order
    const sortedArray = transformedArray.sort((a,b) => moment(a['date']).diff(moment(b['date'])));

    return sortedArray;
  }

  const addGig = () => {
    setGigs([...gigs, {
      description: description,
      amount: amount, 
    }])

    setData([
      ...data, 
      {
        date: moment().format('LL'),
        amount: Number(amount),
      }
    ])

    setDescription(''),
    setAmount('')
  }

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text>Bezier Line Chart</Text>
        {!loading &&
          <LineChart
            data={{              
              labels: getDates(),
              datasets: [
                {
                  data: getAmounts()
                }
              ]
            }}
            width={Dimensions.get("window").width} // from react-native
            height={220}
            yAxisLabel="$"
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
        }
      </View>
      <View>
        <Text style={{marginBottom: 10}}>Total Income: {total}</Text>
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

      {gigs?.map((gig, index) => (
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
