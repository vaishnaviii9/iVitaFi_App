import * as React from "react";
import {StyleSheet, View, Text, Image} from "react-native";
// import Check01 from "../assets/check-01.svg"
// import X02 from "../assets/x-02.svg"

const RecentTransactions = () => {
  	
  	return (
    		<View style={styles.recentTransactions}>
      			<View style={styles.baseBlackParent}>
        				<View style={[styles.baseBlack, styles.basePosition]} />
        				<View style={styles.frameParent}>
          					<View style={[styles.titleParent, styles.titleFlexBox]}>
            						<Text style={[styles.title, styles.titleTypo]}>Pending Transactions</Text>
            						<View style={styles.iconBack}>
              							<View style={[styles.baseIcon, styles.basePosition]} />
              							<Image style={styles.arrowsChevronLeft} resizeMode="cover" source={require('@/assets/images/X02.png')} />
            						</View>
          					</View>
          					<View style={styles.frameGroup}>
            						<View style={styles.downwardAdjustment12182024Parent}>
              							<Text style={[styles.downwardAdjustment12182024Container, styles.adjustmentDateContainerTypo]}>
                								<Text style={styles.downwardAdjustment12182024Container1}>
                  									<Text style={styles.text}>{`25587
`}</Text>
                  									<Text style={styles.downwardAdjustment12182024}>{`Downward Adjustment
                  									12/18/2024`}</Text>
                                </Text>
                            </Text>
                            <Text style={[styles.text1, styles.textTypo]}>$180.00</Text>
                            <Image source={require('@/assets/images/Trash.png')} style={styles.trashIcon} width={24} height={24} />
                            
                            <View style={[styles.titleWrapper, styles.titleWrapperPosition]}>
                                <Text style={[styles.title1, styles.titleTypo]}>J</Text>
                            </View>
                        </View>
                        <View style={styles.downwardAdjustment12182024Parent}>
                            <Text style={[styles.downwardAdjustment12182024Container, styles.adjustmentDateContainerTypo]}>
                                <Text style={styles.downwardAdjustment12182024Container1}>
                  									<Text style={styles.text}>{`26007
                  									`}</Text>
                  									<Text style={styles.downwardAdjustment12182024}>{`Debit Card
                  									01/31/2025`}</Text>
                                </Text>
                            </Text>
                            <Text style={[styles.text1, styles.textTypo]}>$46.00</Text>
                            <Image source={require('@/assets/images/Trash.png')} style={styles.trashIcon} width={24} height={24} />
                            <View style={[styles.titleWrapper, styles.titleWrapperPosition]}>
                                <Text style={[styles.title1, styles.titleTypo]}>J</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.frameWrapper}>
                        <View style={styles.upwardAdjustment12182024Parent}>
                            <Text style={[styles.upwardAdjustment12182024Container, styles.adjustmentDateContainerTypo]}>
                                <Text style={styles.downwardAdjustment12182024Container1}>
                  									<Text style={styles.text}>{`26005
                  									`}</Text>
                  									<Text style={styles.downwardAdjustment12182024}>{`Upward Adjustment
                  									12/18/2024`}</Text>
                                </Text>
                            </Text>
                            <Text style={[styles.text5, styles.textTypo]}>---</Text>
                            <Image source={require('@/assets/images/Check01.png')} style={styles.check01Icon} width={33} height={33} />
                            <Image source={require('@/assets/images/X02.png')} style={styles.x02Icon} width={25} height={27} />
                            <View style={[styles.titleWrapper, styles.titleWrapperPosition]}>
                                <Text style={[styles.title1, styles.titleTypo]}>J</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </View>);
};

const styles = StyleSheet.create({
    basePosition: {
        left: "0%",
        bottom: "0%",
        right: "0%",
        top: "0%",
        height: "100%",
        position: "absolute",
        width: "100%"
    },
    titleFlexBox: {
        flexDirection: "row",
        alignItems: "center",
    },
    titleTypo: {
        textAlign: "left",
        fontFamily: "Inter-SemiBold",
        fontWeight: "600"
    },
    adjustmentDateContainerTypo: {
        width: 167,
        fontSize: 12,
        display: "flex",
        textAlign: "left",
        fontFamily: "Inter-SemiBold",
        fontWeight: "600",
        letterSpacing: -0.1,
        position: "absolute",
        alignItems: "center"
    },
    textTypo: {
        color: "#feeeee",
        fontSize: 15,
        top: 13,
        textAlign: "left",
        fontFamily: "Inter-SemiBold",
        fontWeight: "600",
        letterSpacing: -0.1,
        position: "absolute"
    },
    titleWrapperPosition: {
        left: 0,
        top: 0
    },
    baseBlack: {
        borderRadius: 10,
        backgroundColor: "#27446f",
        borderStyle: "solid",
        borderColor: "rgba(42, 37, 79, 0.05)",
        borderWidth: 1
    },
    title: {
        fontSize: 18,
        color: "#fff",
        letterSpacing: -0.1,
        textAlign: "left",
        fontFamily: "Inter-SemiBold",
        fontWeight: "600"
    },
    baseIcon: {
        borderRadius: 20,
        backgroundColor: "#28234e"
    },
    arrowsChevronLeft: {
        height: "66.5%",
        width: "66.5%",
        top: "79.17%",
        right: "-1183.17%",
        bottom: "-45.67%",
        left: "1216.67%",
        maxWidth: "100%",
        overflow: "hidden",
        maxHeight: "100%",
        position: "absolute"
    },
    iconBack: {
        width: 20,
        height: 20
    },
    titleParent: {
        gap: 100
    },
    text: {
        color: "#fffbfb"
    },
    downwardAdjustment12182024: {
        color: "#ceccff"
    },
    downwardAdjustment12182024Container1: {
        width: "100%"
    },
    downwardAdjustment12182024Container: {
        left: 0,
        top: 0
    },
    text1: {
        left: 174,
        width: 60,
        height: 18,
        display: "flex",
        color: "#feeeee",
        fontSize: 15,
        top: 13,
        alignItems: "center"
    },
    trashIcon: {
        top: 10,
        left: 270,
        position: "absolute"
    },
    title1: {
        fontSize: 14,
        color: "#050a11"
    },
    titleWrapper: {
        borderRadius: 100,
        backgroundColor: "#eef2f8",
        width: 36,
        height: 36,
        justifyContent: "center",
        padding: 12,
        display: "none",
        flexDirection: "row",
        alignItems: "center",
        position: "absolute"
    },
    downwardAdjustment12182024Parent: {
        width: 303,
        height: 45
    },
    frameGroup: {
        width: 286,
        gap: 11
    },
    upwardAdjustment12182024Container: {
        top: -1,
        left: 2
    },
    text5: {
        left: 189
    },
    check01Icon: {
        top: 5,
        left: 240,
        position: "absolute"
    },
    x02Icon: {
        top: 8,
        left: 279,
        position: "absolute"
    },
    upwardAdjustment12182024Parent: {
        width: 310,
        height: 43
    },
    frameWrapper: {
        width: 287,
        height: 45
    },
    frameParent: {
        top: 16,
        left: 16,
        gap: 13,
        position: "absolute"
    },
    baseBlackParent: {
        width: 335,
        height: 229
    },
    recentTransactions: {
        flex: 1,
        height: 228,
        alignItems: "center",
        width: "100%"
    }
});

export default RecentTransactions;
