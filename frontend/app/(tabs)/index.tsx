import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, Text } from "react-native";
import { View } from "react-native";
import ScooterCard, { ScooterCardProps } from "@/components/ScooterCard";
import EmptyState from "@/components/EmptyState";
import { getVehicleListings } from "@/lib/appwrite";
import { Models } from "react-native-appwrite";
import { getFileView } from "@/lib/imageUpload";

const home = () => {
  const [vehicleListings, setVehicleListings] = useState<
    ScooterCardProps[] | null
  >(null);

  useEffect(() => {
    const getImages = async (images: string[]) => {
      return await Promise.all(
        images.map(async (image) => {
          const url = await getFileView(image);
          return url;
        })
      );
    };
    const fetchListings = async () => {
      const listings = await getVehicleListings();


      const vehicleListings = await Promise.all(
        listings?.documents.map(async (doc) => {
          const data = doc as Models.Document;
          const headerImage = await getImages([data?.images[0]]);
          return {
            title: data?.title,
            listingId: data?.$id,
            images: headerImage,
            price: data?.price,
            currency: data?.currency,
            city: data?.city,
            pickupLocation: data?.pickupLocation,
            enginePower: data?.enginePower,
            vehicleType: data?.vehicleType,
            seller: {
              name: data?.seller.username,
              profilePicture: data?.seller.avatar,
              rating: 4.5,
              ratingCount: 5,
            },
          };
        })
      );

      setVehicleListings(vehicleListings);
    };

    fetchListings();
  }, []);

  return (
    <SafeAreaView className="bg-background-950 h-full">
      {/* <ScrollView
        contentContainerStyle={{
          height: "80%",
        }}
      > */}
      <View className="w-full flex justify-center items-center h-full px-4">
        <Text className="text-3xl text-white font-bold text-center">
          Scooters, ATVs, E-Bikes{"\n"} Rentals & More with{" "}
        </Text>
        <FlatList
          data={vehicleListings}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <ScooterCard {...item} />}
          ListHeaderComponent={() => (
            <>
              <View className="flex my-6 px-4">
                <Text className="font-pmedium text-gray-100 text-sm">
                  Search Results
                </Text>
                <Text className="text-2xl font-psemibold text-white mt-1">
                  Scooters, ATVs, E-Bikes Rentals & More
                </Text>

                <View className="mt-6 mb-8">
                  {/* <SearchInput initialQuery={query} refetch={refetch} /> */}
                </View>
              </View>
            </>
          )}
          ListEmptyComponent={() => (
            <EmptyState
              title="No Rentals Found"
              subtitle="No rentals found for the selected dates."
            />
          )}
        />
      </View>
      {/* </ScrollView> */}
    </SafeAreaView>
  );
};

export default home;

// const scooterData: ScooterCardProps[] = [
//   {
//     headerImage:
//       "https://images.unsplash.com/photo-1538895490524-0ded232a96d8?q=80&w=1530&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     title: "Vespa Sprint",
//     vehicleInfo: "Vespa/Sprint/2015",
//     datefrom: "2025-01-01",
//     dateto: "2025-03-25",
//     price: 500,
//     currency: "MXN",
//     vehicleType: "Scooter",
//     vehicleRating: 4.5,
//     vehicleRatingCount: 10,
//     pickupLocation: "Mexico City",
//     seller: {
//       name: "Maria Garcia",
//       profilePicture: "https://randomuser.me/api/portraits/women/36.jpg",
//       rating: 4.6,
//       ratingCount: 20,
//     },
//   },

//   {
//     headerImage:
//       "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?q=80&w=1285&auto=format&fit=crop",
//     title: "Honda PCX 150",
//     vehicleInfo: "Honda/PCX 150/2020",
//     datefrom: "2025-02-01",
//     dateto: "2025-04-15",
//     price: 600,
//     currency: "MXN",
//     vehicleType: "Scooter",
//     vehicleRating: 4.8,
//     vehicleRatingCount: 25,
//     pickupLocation: "Tulum",
//     seller: {
//       name: "Carlos Mendoza",
//       profilePicture: "https://randomuser.me/api/portraits/men/32.jpg",
//       rating: 4.7,
//       ratingCount: 50,
//     },
//   },
//   {
//     headerImage:
//       "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?q=80&w=1285&auto=format&fit=crop",
//     title: "Yamaha NMAX",
//     vehicleInfo: "Yamaha/NMAX/2019",
//     datefrom: "2025-01-15",
//     dateto: "2025-03-30",
//     price: 550,
//     currency: "MXN",
//     vehicleType: "Scooter",
//     vehicleRating: 4.7,
//     vehicleRatingCount: 18,
//     pickupLocation: "Cancun",
//     seller: {
//       name: "Sofia Ramirez",
//       profilePicture: "https://randomuser.me/api/portraits/women/44.jpg",
//       rating: 4.9,
//       ratingCount: 72,
//     },
//   },
//   {
//     headerImage:
//       "https://images.unsplash.com/photo-1597696929733-86d6781645a4?q=80&w=1285&auto=format&fit=crop",
//     title: "Suzuki Burgman 200",
//     vehicleInfo: "Suzuki/Burgman 200/2018",
//     datefrom: "2025-02-10",
//     dateto: "2025-05-01",
//     price: 580,
//     currency: "MXN",
//     vehicleType: "Scooter",
//     vehicleRating: 4.6,
//     vehicleRatingCount: 22,
//     pickupLocation: "Playa del Carmen",
//     seller: {
//       name: "Luis Fernández",
//       profilePicture: "https://randomuser.me/api/portraits/men/55.jpg",
//       rating: 4.6,
//       ratingCount: 40,
//     },
//   },
//   {
//     headerImage:
//       "https://images.unsplash.com/photo-1621886420383-5b3ea28cfab2?q=80&w=1285&auto=format&fit=crop",
//     title: "Vespa Primavera",
//     vehicleInfo: "Vespa/Primavera/2017",
//     datefrom: "2025-01-20",
//     dateto: "2025-03-15",
//     price: 520,
//     currency: "MXN",
//     vehicleType: "Scooter",
//     vehicleRating: 4.9,
//     vehicleRatingCount: 30,
//     pickupLocation: "Mexico City",
//     seller: {
//       name: "Ana Torres",
//       profilePicture: "https://randomuser.me/api/portraits/women/39.jpg",
//       rating: 4.8,
//       ratingCount: 60,
//     },
//   },
//   {
//     headerImage:
//       "https://images.unsplash.com/photo-1529442777344-1b5a4aa09ee2?q=80&w=1285&auto=format&fit=crop",
//     title: "Honda Dio",
//     vehicleInfo: "Honda/Dio/2022",
//     datefrom: "2025-03-01",
//     dateto: "2025-06-10",
//     price: 480,
//     currency: "MXN",
//     vehicleType: "Scooter",
//     vehicleRating: 4.4,
//     vehicleRatingCount: 12,
//     pickupLocation: "Merida",
//     seller: {
//       name: "Fernando Lopez",
//       profilePicture: "https://randomuser.me/api/portraits/men/48.jpg",
//       rating: 4.5,
//       ratingCount: 33,
//     },
//   },
//   {
//     headerImage:
//       "https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1285&auto=format&fit=crop",
//     title: "Kymco Agility 125",
//     vehicleInfo: "Kymco/Agility 125/2016",
//     datefrom: "2025-02-15",
//     dateto: "2025-04-30",
//     price: 450,
//     currency: "MXN",
//     vehicleType: "Scooter",
//     vehicleRating: 4.3,
//     vehicleRatingCount: 15,
//     pickupLocation: "Tulum",
//     seller: {
//       name: "Valeria Santos",
//       profilePicture: "https://randomuser.me/api/portraits/women/50.jpg",
//       rating: 4.6,
//       ratingCount: 29,
//     },
//   },
//   {
//     headerImage:
//       "https://images.unsplash.com/photo-1612828464326-75b0383af759?q=80&w=1285&auto=format&fit=crop",
//     title: "Aprilia SR 160",
//     vehicleInfo: "Aprilia/SR 160/2021",
//     datefrom: "2025-02-05",
//     dateto: "2025-04-20",
//     price: 620,
//     currency: "MXN",
//     vehicleType: "Scooter",
//     vehicleRating: 4.7,
//     vehicleRatingCount: 20,
//     pickupLocation: "Cancun",
//     seller: {
//       name: "Jose Martinez",
//       profilePicture: "https://randomuser.me/api/portraits/men/25.jpg",
//       rating: 4.9,
//       ratingCount: 80,
//     },
//   },
//   {
//     headerImage:
//       "https://images.unsplash.com/photo-1574734582344-8b4b1a05c49a?q=80&w=1285&auto=format&fit=crop",
//     title: "Vespa GTS 300",
//     vehicleInfo: "Vespa/GTS 300/2019",
//     datefrom: "2025-01-10",
//     dateto: "2025-03-05",
//     price: 700,
//     currency: "MXN",
//     vehicleType: "Scooter",
//     vehicleRating: 5.0,
//     vehicleRatingCount: 35,
//     pickupLocation: "Mexico City",
//     seller: {
//       name: "Camila Rodriguez",
//       profilePicture: "https://randomuser.me/api/portraits/women/19.jpg",
//       rating: 5.0,
//       ratingCount: 95,
//     },
//   },
//   {
//     headerImage:
//       "https://images.unsplash.com/photo-1530826299810-b48a7cd3de7b?q=80&w=1285&auto=format&fit=crop",
//     title: "Yamaha Aerox",
//     vehicleInfo: "Yamaha/Aerox/2018",
//     datefrom: "2025-03-10",
//     dateto: "2025-05-25",
//     price: 530,
//     currency: "MXN",
//     vehicleType: "Scooter",
//     vehicleRating: 4.6,
//     vehicleRatingCount: 17,
//     pickupLocation: "Playa del Carmen",
//     seller: {
//       name: "Gabriel Hernandez",
//       profilePicture: "https://randomuser.me/api/portraits/men/61.jpg",
//       rating: 4.7,
//       ratingCount: 45,
//     },
//   },
//   {
//     headerImage:
//       "https://images.unsplash.com/photo-1549638441-b787d2e11f14?q=80&w=1285&auto=format&fit=crop",
//     title: "Piaggio Liberty 150",
//     vehicleInfo: "Piaggio/Liberty 150/2017",
//     datefrom: "2025-01-05",
//     dateto: "2025-03-20",
//     price: 510,
//     currency: "MXN",
//     vehicleType: "Scooter",
//     vehicleRating: 4.5,
//     vehicleRatingCount: 14,
//     pickupLocation: "Tulum",
//     seller: {
//       name: "Ricardo Alvarez",
//       profilePicture: "https://randomuser.me/api/portraits/men/37.jpg",
//       rating: 4.4,
//       ratingCount: 32,
//     },
//   },
// ];
