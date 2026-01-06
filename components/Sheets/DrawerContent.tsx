import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ViewStyle,
  TextStyle,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import { DrawerContentComponentProps } from '@react-navigation/drawer';

// Redux & Services
import {
  selectRouteList,
  setAddressDetailsList,
  setAddressList,
  setAddressListId,
  setRouteList,
} from '../../state/navSlice';

import { useAppDispatch, useAppSelector } from '../../state/store';
import getUserAddressList from '../../service/RouteAddressList/Get/getUserAddressList';
import deleteRouteListByListId from '../../service/RouteAddressList/Delete/deleteRouteListByListId';
import getUserId from '../../service/User/Get/getUserId';
import fetchAddressesForSelectedList from '../../service/Address/Fetch/fetchAddressesForSelectedList';
import deleteAllStopDetails from '../../service/StopDetails/Delete/deleteAllStopDetails';

// --- Interfaces ---
interface FormattedRoute {
  id: string;
  label: string;
  createDate: string | number | Date;
}

// --- Component ---

const DrawerContent: React.FC<DrawerContentComponentProps> = ({ navigation }) => {
  const dispatch = useAppDispatch()
  const routeList = useAppSelector(selectRouteList);
  const [routeListDataConvertor, setAddressListDataConvertor] = useState<
    FormattedRoute[]
  >([]);

  useEffect(() => {
    if (Array.isArray(routeList)) {
      const formattedList: FormattedRoute[] = routeList.map(item => ({
        id: item.id,
        label: item.list_name,
        createDate: item.createdAt || new Date(),
      }));
      setAddressListDataConvertor(formattedList);
    }
    if (routeList.length === 0) {
      dispatch(setAddressList([]));
    }
  }, [dispatch, routeList]);

  // Memoized handlers to prevent child re-renders
  const handleRoutePress = useCallback(
    async (listId: string) => {

      try {
        await fetchAddressesForSelectedList(listId, dispatch);
        navigation.closeDrawer();
      } catch (error) {
        console.error('Error fetching addresses:', error);
      }
    },
    [dispatch, navigation],
  );

  const handleRemoveList = useCallback(
    async (list_id: string) => {
      const user_id = await getUserId();
      try {
        await deleteAllStopDetails(list_id);
        await deleteRouteListByListId(list_id, user_id);
        const updatedList = await getUserAddressList(user_id);

        dispatch(setAddressList([]));
        dispatch(setAddressDetailsList([]));
        dispatch(setAddressListId(''));
        dispatch(setRouteList(updatedList));
      } catch (error) {
        console.error('Failed to refresh list:', error);
      }
    },
    [dispatch],
  );

  // --- STABLE RENDER FUNCTIONS ---
  // Extracting this prevents the "Do not define components during render" error

  const renderItem = useCallback(
    ({ item }: { item: FormattedRoute }) => (
      <TouchableOpacity
        style={styles.routeItemButton}
        onPress={() => handleRoutePress(item.id)}
        activeOpacity={0.8}
      >
        <View style={styles.routeItemIconBox}>
          <Icon name="map-marker" size={24} color="white" />
        </View>
        <View style={styles.routeItemTextSection}>
          <Text style={styles.routeItemTitle}>{item.label}</Text>
          <Text style={styles.routeItemDate}>
            <Icon name="calendar" size={14} color="gray" />
            {` ${new Date(item.createDate).toLocaleDateString()}`}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => handleRemoveList(item.id)}
          style={styles.routeItemDeleteAction}
        >
          <Icon name="trash" size={20} color="#d9534f" />
        </TouchableOpacity>
        <Icon name="chevron-right" size={18} color="green" />
      </TouchableOpacity>
    ),
    [handleRoutePress, handleRemoveList],
  );

  const renderSeparator = useCallback(
    () => <View style={styles.listSeparator} />,
    [],
  );

  return (
    <SafeAreaView style={styles.drawerMainContainer}>
      {routeListDataConvertor.length >= 1 ? (
        <FlatList
          data={routeListDataConvertor}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={renderSeparator}
          renderItem={renderItem}
          contentContainerStyle={styles.scrollableListArea}
        />
      ) : (
        <View style={styles.emptyStateContainer}>
          <Icon name="inbox" size={60} color="#e0e0e0" />
          <Text style={styles.emptyStateText}>No routes available</Text>
          <Text style={styles.emptyStateText}>Create a Route</Text>
        </View>
      )}

      <TouchableOpacity
        onPress={() => navigation.navigate('ListScreen')}
        style={styles.createRouteFloatingButton}
      >
        <Icon name="plus" size={24} color="white" />
        <Text style={styles.createRouteButtonText}>Create Route</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

// --- Styles with Unique Naming ---

const styles = StyleSheet.create({
  drawerMainContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  } as ViewStyle,
  routeItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#caeaeb',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginHorizontal: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 8,
  } as ViewStyle,
  routeItemIconBox: {
    backgroundColor: '#007bff',
    borderRadius: 12,
    padding: 12,
    marginRight: 16,
  } as ViewStyle,
  routeItemTextSection: {
    flex: 1,
    paddingRight: 16,
  } as ViewStyle,
  routeItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  } as TextStyle,
  routeItemDate: {
    fontSize: 14,
    color: 'black',
  } as TextStyle,
  listSeparator: {
    height: 8,
    backgroundColor: 'transparent',
  } as ViewStyle,
  scrollableListArea: {
    paddingBottom: 120,
    paddingTop: 70,
  } as ViewStyle,
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  } as ViewStyle,
  emptyStateText: {
    fontSize: 18,
    color: '#95a5a6',
    marginTop: 16,
    textAlign: 'center',
  } as TextStyle,
  createRouteFloatingButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
  } as ViewStyle,
  createRouteButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 12,
    fontSize: 16,
  } as TextStyle,
  routeItemDeleteAction: {
    marginRight: 8,
  } as ViewStyle,
});

export default DrawerContent;
