import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { database, auth } from "../../firebase";
import { collection, query, where, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';


export default function Settings () {
    const navigation = useNavigation();

    const handleDeleteUser = async () => {
      Alert.alert(
        "Удаление пользователя",
        "Вы точно хотите удалить пользователя и все данные о нем?",
        [
          {
            text: "Отмена",
            style: "cancel"
          },
          {
            text: "Удалить",
            onPress: async () => {
              try {
                const qUsers = query(collection(database, "users"), where("email", "==", auth.currentUser.email));
                const querySnapshotUsers = await getDocs(qUsers);
                const deleteUserDocs = querySnapshotUsers.docs.map((doc) => deleteDoc(doc.ref));
    
                const qPosts = query(collection(database, "posts"), where("author.email", "==", auth.currentUser.email));
                const querySnapshotPosts = await getDocs(qPosts);
                const deletePostDocs = querySnapshotPosts.docs.map((doc) => deleteDoc(doc.ref));
    
                const qAllUsers = query(collection(database, "users"));
                const querySnapshotAllUsers = await getDocs(qAllUsers);
                const updateFriendsDocs = querySnapshotAllUsers.docs.map(async (doc) => {
                  const user = doc.data();
                  const updatedFriendsList = user.friendsList?.filter(friend => friend.email !== auth.currentUser.email) ?? [];
                  const updatedFriendsRequests = user.friendsRequests?.filter(request => request.email !== auth.currentUser.email) ?? [];
                  if (updatedFriendsList.length !== user.friendsList?.length || updatedFriendsRequests.length !== user.friendsRequests?.length) {
                    await updateDoc(doc.ref, { friendsList: updatedFriendsList, friendsRequests: updatedFriendsRequests });
                  }
                });
    
                // Wait for all async operations to complete
                await Promise.all([...deleteUserDocs, ...deletePostDocs, ...updateFriendsDocs]);
    
                // Delete the user from the authentication system
                await auth.currentUser.delete();
                console.log("Success delete user");
    
                // Navigate to the 'Auth' screen
                navigation.navigate("Auth");
              } catch (error) {
                console.log("Error deleting user:", error.message);
              }
            },
            style: "destructive"
          }
        ]
      );
    }    

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={{marginTop: 33, marginLeft: 15, alignSelf: 'center'}} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-circle" size={50} color="#fff" />
        </TouchableOpacity>
        <Text style={{marginTop: 33, color: '#fff', alignSelf: 'center', fontSize: 30, fontWeight: '700'}}>Настройки</Text>
        <View onPress={() => {}}>
            <Text style={{color: '#305a82'}}>dfshjfffd</Text>
        </View>
      </View>
      <View style={styles.main}>
        <TouchableOpacity style={styles.addImageButton} onPress={handleDeleteUser}>
            <Text style={{fontWeight: 'bold', color: '#fff', fontSize: 17, marginLeft: 10}}>Удалить аккаунт</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#ffffff",
        height: "100%",
    },
    header: {
        height: 120,
        backgroundColor: '#305a82',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    main: {
        height: '100%',
        alignItems: 'center'
    },
    addImageButton: {
        backgroundColor: '#f97c7c',
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 0,
        width: "100%",
        marginHorizontal: 12,
        marginTop: 15,
        width: 390,
        flexDirection: 'row'
      }
})

