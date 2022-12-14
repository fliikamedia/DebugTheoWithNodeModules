import React from 'react';
import {SafeAreaView,View, TouchableOpacity} from 'react-native';
import { createDrawerNavigator,  DrawerContentScrollView,
    DrawerItemList,
    DrawerItem, } from '@react-navigation/drawer';
import { useDispatch, useSelector } from "react-redux";
import { fetchMovies } from '../../store/actions/movies';
import { GENRE, MOVIESTACK, WATCHLIST } from '../../constants/RouteNames';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';

const DrawerItems = (props) => {

const movies = useSelector((state) => state.movies);
const dispatch = useDispatch();

/* React.useEffect(() => {
    fetchMovies()(dispatch);
}, []); */

  const genreArray = movies.availableMovies.map((r) => r.genre);
  let allGenre = [];
  for (let i = 0; i < genreArray.length; i++) {
    allGenre.push(...genreArray[i]);
  }

  let allGenreTrimmed = [];
  for (let i = 0; i < allGenre.length; i++) {
    allGenreTrimmed.push(allGenre[i].trim())
  }
  const genres = [...new Set(allGenreTrimmed)];
  return (
    <View style={{flex: 1,backgroundColor: "black", paddingTop: 0}}>
       <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              colors={["black", "#000020","#000025"]}
              style={{flex: 1}}
            >
               <DrawerContentScrollView contentContainerStyle={{ marginTop: 0}}  {...props}>
           <TouchableOpacity
         style={{ alignSelf: 'flex-end', marginRight: 30}}
         onPress={() => props.navigation.closeDrawer()}
         >
         <AntDesign name="close" size={25} color="#fff"  />
         </TouchableOpacity>
             <View >
         <DrawerItem
          label={'My watchlist'}
          labelStyle={{fontSize: 20, color: "#fff"}}
          onPress={() => props.navigation.navigate(WATCHLIST)}
        />
         </View>
         <View  style={{borderTopWidth: 0.5, borderTopColor: '#fff', paddingBottom: 0, width: '90%', alignSelf: 'center', marginTop: 5}}></View>
         <View style={{flex: 1, marginBottom: 0}}>
     
        {
                genres.map((item, index) => (
                  <DrawerItem key={index} label={item} labelStyle={{fontSize: 20, color: "#fff"}} 
                              onPress={()=> {
                      props.navigation.closeDrawer();
                      props.navigation.navigate(GENRE, {genre: item})
                  }} />
                ))
              }
      </View>
      <View  style={{borderTopWidth: 0.5, borderTopColor: '#fff', paddingBottom: 5, width: '90%', alignSelf: 'center'}}></View>
      <View>
      <DrawerItem
          label={`Fliika \u00A9 2022`}
          labelStyle={{fontSize: 14, color: "darkgrey", paddingBottom: 0}}
          />
        </View>
          </DrawerContentScrollView>
        </LinearGradient>
      </View>
  )
};

export default DrawerItems;
