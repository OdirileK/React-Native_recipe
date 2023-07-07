import { StyleSheet, Text, View, ScrollView, StatusBar, ActivityIndicator, Image, SafeAreaView, FlatList } from "react-native";
import React, { useState, useEffect } from 'react'
import { Appbar, Card, Paragraph, TextInput } from "react-native-paper";
import filter from "lodash.filter";

export default function Page() {

  const [meals, setMeals] = useState([]);
  const [searchQuery, setSearchQuery] = useState([])
  const [isLoading, setIsloading] = useState(false)
  const [error, setError] = useState(null)
  const [fullData, setFullData] = useState([])


  const apiURL = 'https://www.themealdb.com/api/json/v1/1/categories.php';

  useEffect(() => {
    setIsloading(true)
    getMeals()
  }, [])

  const getMeals = async function () {
    try{
      const res = await fetch(apiURL);
    const data = await res.json();
    // console.log(data.categories)
    setMeals(data.categories)
    setIsloading(false)
    setFullData(data.categories)
    
    }
    catch (err) {
      console.log(err)
      setIsloading(false)
    }
  }

const contains = ({strCategory}, query) => {
  if (strCategory.includes(query)) {
    return true;
  }
  else {
      return false;
  }
}


  const handleSearch = (query) => {
    setSearchQuery(query)
    //convert inserted data to lowercase
    const formattedQuery =  query.toLowerCase();
    const filteredData = filter(fullData, (meal) => {
      return contains(meal, formattedQuery)
    })
    setMeals(filteredData)
  }

  if (isLoading) {
    return (
    <View>
    <ActivityIndicator size={'large'} color='#00bfff'/> 
    </View>
    )
  }

  if (error) {
    return (
    <View>
      <Text>Error fetching data... please check internet connection</Text>
    </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Appbar>
        <Appbar.Content title='Recipe App' style={styles.headerText}/>
      </Appbar>
      <StatusBar style='auto' />
     
      <TextInput placeholder="Search" 
      clearButtonMode="always"
      style={styles.searchbox} 
      value={searchQuery} onChangeText={(query => handleSearch(query))}
      />
      <FlatList 
      // numColumns={3}
        data={meals}
        keyExtractor={(item) => item.idCategory}
        renderItem={({item}) => (
          <View style={styles.container}>
            <Image source={{uri: item.strCategoryThumb}} style={styles.image}/>
            <Text style={styles.heading}> {item.strCategory} </Text>
            <Paragraph>{item.strCategoryDescription}</Paragraph>
          </View>
        )}
      />
      
    </SafeAreaView>
  );


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  },

  image: {
    width: 200,
    height: 140,
    borderRadius: 25
  },
  searchbox: {
    width: 200,
    height: 30,
    borderColor: 'gray',
    borderWidth: 1,
    
    backgroundColor: '#ffff'
  },
  heading: {
    fontSize: 26,
    fontWeight: "700"
  }
});
