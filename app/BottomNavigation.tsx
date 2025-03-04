import * as React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import styles from "./BottomNavigationStyles";

interface BottomNavigationProps {
  activeTab: string;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab }) => {
  const navigation = useNavigation<any>();
;

  return (
    <View style={styles.container}>
      <View style={styles.bottomNavigation}>
        {/* Home */}
        <TouchableOpacity
          style={[styles.navItem, activeTab === "Home" ? styles.activeTab : null]}
          onPress={() => navigation.navigate("Home")}
        >
          <Entypo name="home" size={26} color={activeTab === "Home" ? "black" : "#5e5f60"} />
          <Text style={[styles.label, activeTab === "Home" ? styles.activeLabel : null]}>
            Home
          </Text>
        </TouchableOpacity>

        {/* Statements */}
        <TouchableOpacity
          style={[styles.navItem, activeTab === "Statements" ? styles.activeTab : null]}
          onPress={() => navigation.navigate("Statements")}
        >
          <Ionicons name="document-text-outline" size={26} color={activeTab === "Statements" ? "black" : "#5e5f60"} />
          <Text style={[styles.label, activeTab === "Statements" ? styles.activeLabel : null]}>
            Statements
          </Text>
        </TouchableOpacity>

        {/* Documents */}
        <TouchableOpacity
          style={[styles.navItem, activeTab === "Documents" ? styles.activeTab : null]}
          onPress={() => navigation.navigate("Documents")}
        >
          <FontAwesome6 name="folder-closed" size={24} color={activeTab === "Documents" ? "black" : "#5e5f60"} />
          <Text style={[styles.label, activeTab === "Documents" ? styles.activeLabel : null]}>
            Documents
          </Text>
        </TouchableOpacity>

        {/* Transactions */}
        <TouchableOpacity
          style={[styles.navItem, activeTab === "Transactions" ? styles.activeTab : null]}
          onPress={() => navigation.navigate("Transactions")}
        >
          <FontAwesome6 name="arrow-right-arrow-left" size={24} color={activeTab === "Transactions" ? "black" : "#5e5f60"} />
          <Text style={[styles.label, activeTab === "Transactions" ? styles.activeLabel : null]}>
            Transactions
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BottomNavigation;
