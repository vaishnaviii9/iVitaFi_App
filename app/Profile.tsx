import React, { useEffect, useState } from "react";
import styles from "../components/styles/ProfileScreenStyles";
import {
  Image,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { router } from "expo-router";
import { useSelector } from "react-redux";
import {
  FontAwesome,
  MaterialIcons,
  Entypo,
  Feather,
  Ionicons,
} from "@expo/vector-icons";
import { fetchUserData, updateCustomer } from "./services/userService";
import { fetchCreditSummariesWithId } from "./services/creditAccountService";
import { fetchCustomerData } from "./services/customerService";
import Toast from "react-native-toast-message";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialIcons";

const ProfileScreen = () => {
  interface UserData {
    firstName: string | null;
    lastName: string | null;
    dateOfBirth: string | null;
    ssn: string | null;
    mobilePhone: string | null;
    homePhone: string | null;
    physicalAddress: string | null;
    mailingAddress: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
    email: string | null;
  }

  const token = useSelector((state: any) => state.auth.token);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [customer, setCustomer] = useState(null);

  const [userData, setUserData] = useState<UserData | null>(null);
  const [emailInput, setEmailInput] = useState<string | null>(null);
  const [customerResponse, setCustomerResponse] = useState<any>(null);

  const getUserData = async () => {
    const data = await fetchUserData(token, setUserData);
    if (data) {
      const mappedData: UserData = {
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        dateOfBirth: data.customer?.dateOfBirth
          ? new Date(data.customer.dateOfBirth).toLocaleDateString()
          : null,
        ssn: formatSSN(data.customer?.taxId) || null,
        mobilePhone: formatPhoneNumber(data.customer?.mobilePhone) || null,
        homePhone: data.customer?.homePhone || null,
        physicalAddress: data.customer?.streetAddress || null,
        mailingAddress: data.customer?.streetAddressOptional || null,
        city: data.customer?.city || null,
        state: formatState(data.customer?.state) || null,
        zip: data.customer?.zipCode || null,
        email: data.email || null,
      };
      setUserData(mappedData);

      setEmailInput(data.email || "");
    }
  };

  useEffect(() => {
    getUserData();
  }, [token]);

  const handleBackPress = () => {
    router.push("/(tabs)/Home");
  };

  const capitalizeWords = (str: string) => {
    if (!str) return str;
    return str.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  const handleSave = async () => {
    if (!emailInput) {
      console.log("Email is required");
      return;
    }

    setFormSubmitted(true);
    setIsSaving(true);
    setIsLoading(true);

    try {
      const customerResponse = await fetchCustomerData(token, (data) => {});
      setCustomerResponse(customerResponse);

      if (customerResponse) {
        const { creditSummaries } = await fetchCreditSummariesWithId(
          customerResponse,
          token
        );

        if (creditSummaries && creditSummaries.length > 0) {
          const customerId =
            creditSummaries[0]?.detail?.creditAccount?.customerId;

          if (customerId) {
            const updatedCustomer = {
              ...customerResponse,
              city: capitalizeWords(customerResponse.city),
              streetAddress: capitalizeWords(customerResponse.streetAddress),
              streetAddressOptional: capitalizeWords(
                customerResponse.streetAddressOptional
              ),
              altMobilePhone: customerResponse.altMobilePhone,
              businessPhone: customerResponse.businessPhone,
              dateOfBirth: customerResponse.dateOfBirth,
              homePhone: customerResponse.homePhone,
              income: customerResponse.income,
              mobilePhone: customerResponse.mobilePhone,
              state: customerResponse.state,
              taxId: customerResponse.taxId,
              zipCode: customerResponse.zipCode,
              user: {
                ...customerResponse.user,
                email: emailInput,
              },
            };

            const response = await updateCustomer(
              customerId,
              updatedCustomer,
              token
            );

            if (response?.type === "data") {
              Toast.show({
                type: "success",
                text1: "Success",
                text2: "Profile updated successfully.",
              });

              await getUserData();
            }
          } else {
            Toast.show({
              type: "error",
              text1: "Error",
              text2: "Error occurred.",
            });
          }
        }
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Error occurred.",
      });
    } finally {
      setIsSaving(false);
      setIsLoading(false);
    }
  };

  const formatSSN = (ssn: string | null): string | null => {
    if (!ssn) return null;
    return `xxx-xx-${ssn.slice(-4)}`;
  };

  const formatPhoneNumber = (phone: string | null): string | null => {
    if (!phone) return null;
    const cleaned = ("" + phone).replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return null;
  };

  const formatState = (state: string | null): string | null => {
    if (!state) return null;

    const stateAbbreviations: { [key: string]: string } = {
      AL: "Alabama",
      AK: "Alaska",
      AZ: "Arizona",
      AR: "Arkansas",
      CA: "California",
      CO: "Colorado",
      CT: "Connecticut",
      DE: "Delaware",
      DC: "District of Columbia",
      FL: "Florida",
      GA: "Georgia",
      HI: "Hawaii",
      ID: "Idaho",
      IL: "Illinois",
      IN: "Indiana",
      IA: "Iowa",
      KS: "Kansas",
      KY: "Kentucky",
      LA: "Louisiana",
      ME: "Maine",
      MD: "Maryland",
      MA: "Massachusetts",
      MI: "Michigan",
      MN: "Minnesota",
      MS: "Mississippi",
      MO: "Missouri",
      MT: "Montana",
      NE: "Nebraska",
      NV: "Nevada",
      NH: "New Hampshire",
      NJ: "New Jersey",
      NM: "New Mexico",
      NY: "New York",
      NC: "North Carolina",
      ND: "North Dakota",
      OH: "Ohio",
      OK: "Oklahoma",
      OR: "Oregon",
      PA: "Pennsylvania",
      RI: "Rhode Island",
      SC: "South Carolina",
      SD: "South Dakota",
      TN: "Tennessee",
      TX: "Texas",
      UT: "Utah",
      VT: "Vermont",
      VA: "Virginia",
      WA: "Washington",
      WV: "West Virginia",
      WI: "Wisconsin",
      WY: "Wyoming",
    };

    return stateAbbreviations[state]
      ? `${state} - ${stateAbbreviations[state]}`
      : state;
  };

  const detailItems = [
    {
      label: "First Name",
      value: userData?.firstName ?? "-",
      icon: <FontAwesome name="user" size={24} color="#000" />,
    },
    {
      label: "Last Name",
      value: userData?.lastName ?? "-",
      icon: <FontAwesome name="user" size={24} color="#000" />,
    },
    {
      label: "Date of Birth",
      value: userData?.dateOfBirth ?? "-",
      icon: <FontAwesome name="calendar" size={24} color="#000" />,
    },
    {
      label: "SSN",
      value: userData?.ssn ?? "-",
      icon: <Feather name="hash" size={24} color="#000" />,
    },
    {
      label: "Email",
      value: (
        <TextInput
          style={styles.input}
          value={emailInput ?? ""}
          onChangeText={setEmailInput}
          placeholder="Enter email"
          keyboardType="email-address"
        />
      ),
      icon: <MaterialIcons name="email" size={24} color="#000" />,
    },
    {
      label: "Mobile Phone",
      value: userData?.mobilePhone ?? "-",
      icon: <Feather name="phone" size={24} color="#000" />,
    },
    {
      label: "Home Phone",
      value: userData?.homePhone ?? "-",
      icon: <Feather name="phone-call" size={24} color="#000" />,
    },
    {
      label: "Physical Address",
      value: userData?.physicalAddress ?? "-",
      icon: <Entypo name="address" size={24} color="#000" />,
    },
    {
      label: "Mailing Address",
      value: userData?.mailingAddress ?? "-",
      icon: <Entypo name="mail" size={24} color="#000" />,
    },
    {
      label: "City",
      value: userData?.city ?? "-",
      icon: <MaterialIcons name="location-city" size={24} color="#000" />,
    },
    {
      label: "State",
      value: userData?.state ?? "-",
      icon: <MaterialIcons name="map" size={24} color="#000" />,
    },
    {
      label: "Zip",
      value: userData?.zip ?? "-",
      icon: <FontAwesome name="envelope" size={24} color="#000" />,
    },
  ];

  const toastConfig = {
    success: ({ text1, text2, ...rest }: any) => (
      <View
        style={{
          backgroundColor: "#d4edda",
          padding: 15,
          borderRadius: 10,
          margin: 10,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <MaterialCommunityIcons
          name="check-circle"
          size={24}
          color="#155724"
          style={{ marginRight: 10 }}
        />
        <View>
          <Text style={{ fontSize: 16, fontWeight: "bold", color: "#155724" }}>
            {text1}
          </Text>
          <Text style={{ fontSize: 14, color: "#155724" }}>{text2}</Text>
        </View>
      </View>
    ),
    error: ({ text1, text2, ...rest }: any) => (
      <View
        style={{
          backgroundColor: "#f8d7da",
          padding: 15,
          borderRadius: 10,
          margin: 10,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <MaterialIcons name="error" size={24} color="#721c24" style={{ marginRight: 10 }} />
        <View>
          <Text style={{ fontSize: 16, fontWeight: "bold", color: "#721c24" }}>
            {text1}
          </Text>
          <Text style={{ fontSize: 14, color: "#721c24" }}>{text2}</Text>
        </View>
      </View>
    ),
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerItems}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Profile</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.avatar}>
          <Image
            source={require("../assets/images/profile.png")}
            style={styles.avatarIcon}
          />
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {detailItems.map((item, index) => (
            <View key={index} style={styles.row}>
              <View style={styles.icon}>{item.icon}</View>
              <View>
                <Text style={styles.label}>{item.label}</Text>
                {typeof item.value === "string" ? (
                  <Text style={styles.value}>{item.value}</Text>
                ) : (
                  item.value
                )}
              </View>
            </View>
          ))}
          <View style={styles.saveButtonContainer}>
            <TouchableOpacity
              style={[styles.saveButton, isSaving && styles.disabledButton]}
              onPress={handleSave}
              disabled={isSaving}
            >
              <Text style={styles.saveButtonText}>
                {isSaving ? "Saving..." : "SAVE"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      <Toast config={toastConfig} />
    </View>
  );
};

export default ProfileScreen;
