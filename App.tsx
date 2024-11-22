import React, { useState } from 'react';
import { View, Text, Button, FlatList, TextInput, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ScrollView } from 'react-native';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  course: string;
}

const Stack = createStackNavigator();

const App = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { id: '1', name: 'Caprese Salad', description: 'Mozzarella, tomatoes, basil.', price: '60.00', course: 'Appetizer' },
    { id: '2', name: 'Filet Mignon', description: 'Steak with red wine reduction.', price: '150.00', course: 'Main Course' },
    { id: '3', name: 'Lemon Tart', description: 'Zesty lemon curd in pastry shell.', price: '70.00', course: 'Dessert' },
    { id: '4', name: 'Greek Salad', description: 'Crisp lettuce, feta, olives, and cucumbers with a lemon vinaigrette.', price: '80.00', course: 'Salad' },
    { id: '5', name: 'Seafood Paella', description: 'Traditional Spanish rice dish with shrimp, clams, and mussels.', price: '95.00', course: 'Main Course' },
    { id: '6', name: 'Champagne', description: 'A glass of bubbly champagne.', price: '120.00', course: 'Beverage' },
    { id: '7', name: 'Stuffed Mushrooms', description: 'Mushrooms filled with cream cheese and herbs, baked until golden.', price: '50.00', course: 'Appetizer' },
    { id: '8', name: 'Spaghetti Carbonara', description: 'Classic Italian pasta with eggs, cheese, pancetta, and pepper.', price: '65.00', course: 'Main Course' },
    { id: '9', name: 'Crème Brûlée', description: 'Vanilla custard topped with a caramelized sugar crust.', price: '85.00', course: 'Dessert' },
  ]);

  const [filteredCourse, setFilteredCourse] = useState('All');

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeScreen">
        <Stack.Screen name="HomeScreen">
          {(props) => (
            <HomeScreen {...props} menu={menuItems} setMenu={setMenuItems} filteredCourse={filteredCourse} setFilteredCourse={setFilteredCourse} />
          )}
        </Stack.Screen>
        <Stack.Screen name="ManageMenu">
          {(props) => (
            <ManageMenu {...props} menu={menuItems} setMenu={setMenuItems} />
          )}
        </Stack.Screen>
        <Stack.Screen name="FilterMenu">
          {(props) => (
            <FilterMenu {...props} setFilter={(course: string) => setFilteredCourse(course)} />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const HomeScreen = ({ menu, setMenu, filteredCourse, setFilteredCourse, navigation }: any) => {
  const calculateAverage = (course: string) => {
    const filtered = menu.filter((item: any) => item.course === course);
    const totalPrice = filtered.reduce((sum: any, item: any) => sum + parseFloat(item.price), 0);
    return filtered.length > 0 ? (totalPrice / filtered.length).toFixed(2) : '0.00';
  };

  const filteredMenu = filteredCourse === 'All' 
    ? menu
    : menu.filter(item => item.course === filteredCourse);

  const removeMenuItem = (id: string) => {
    setMenu((prevMenu: MenuItem[]) => prevMenu.filter((item) => item.id !== id));
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Chef's Menu</Text>
        <Text>Total Items: {menu.length}</Text>
        <Text>Starters Avg: ${calculateAverage('Appetizer')}</Text>
        <Text>Mains Avg: ${calculateAverage('Main Course')}</Text>
        <Text>Desserts Avg: ${calculateAverage('Dessert')}</Text>
        <FlatList
          data={filteredMenu}
          keyExtractor={(item: any) => item.id.toString()}
          renderItem={({ item }: any) => (
            <View style={styles.menuItem}>
              <Text>{`${item.name} - $${item.price} (${item.course})`}</Text>
              <TouchableOpacity onPress={() => removeMenuItem(item.id)}>
                <Text style={styles.removeButton}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
        />
        <TouchableOpacity
          style={styles.manageMenuButton}
          onPress={() => navigation.navigate('ManageMenu', { menu })}
        >
          <Text style={styles.manageMenuButtonText}>Manage Menu</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.manageMenuButton}
          onPress={() => navigation.navigate('FilterMenu')}
        >
          <Text style={styles.manageMenuButtonText}>Filter Menu</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const FilterMenu = ({ navigation, setFilter }: any) => {
  const [selectedCourse, setSelectedCourse] = useState('All');

  const applyFilter = () => {
    setFilter(selectedCourse);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filter Menu By Course</Text>
      <Picker
        selectedValue={selectedCourse}
        onValueChange={(value) => setSelectedCourse(value)}
        style={styles.picker}
      >
        <Picker.Item label="All" value="All" />
        <Picker.Item label="Appetizer" value="Appetizer" />
        <Picker.Item label="Main Course" value="Main Course" />
        <Picker.Item label="Dessert" value="Dessert" />
        <Picker.Item label="Beverage" value="Beverage" />
      </Picker>
      <Button title="Apply Filter" onPress={applyFilter} />
    </View>
  );
};

const ManageMenu = ({ navigation, menu, setMenu }: any) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('Appetizer');
  const [price, setPrice] = useState('');

  const addItem = () => {
    const newItem = { id: (menu.length + 1).toString(), name, description, price, course };
    setMenu([...menu, newItem]);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Menu Item</Text>
      <TextInput placeholder="Dish Name" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={styles.input} />
      <Picker selectedValue={course} onValueChange={(value) => setCourse(value)} style={styles.picker}>
        <Picker.Item label="Appetizer" value="Appetizer" />
        <Picker.Item label="Main Course" value="Main Course" />
        <Picker.Item label="Dessert" value="Dessert" />
        <Picker.Item label="Beverage" value="Beverage" />
      </Picker>
      <TextInput placeholder="Price" value={price} onChangeText={setPrice} style={styles.input} keyboardType="numeric" />
      <Button title="Add Item" onPress={addItem} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, padding: 10, backgroundColor: '#4682b4', borderRadius: 8 },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10 },
  picker: { height: 50, marginBottom: 20 },
  removeButton: { color: 'red', marginTop: 10, textAlign: 'right' },
  menuItem: { marginBottom: 20 },
  manageMenuButton: { marginTop: 20, padding: 10, backgroundColor: '#4682b4', borderRadius: 8 },
  manageMenuButtonText: { color: '#fff', textAlign: 'center', fontSize: 18 },
  scrollContainer: { flexGrow: 1 },
});

export default App;
