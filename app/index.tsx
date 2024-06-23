import { View, Text, Pressable } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Entypo from "@expo/vector-icons/Entypo";
import * as AuthSession from "expo-auth-session";

const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
};

const clientId = process.env.MATCH_SPOTIFY_CLIENT_ID as string;

const redirectUri = AuthSession.makeRedirectUri({
  scheme: "spotify-app",
});

const Login = () => {
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId,
      scopes: [
        "user-read-email",
        "user-lirary-read",
        "user-read-recently-played",
        "user-top-read",
        "playlist-read-private",
        "playlist-read-collaborative",
        "playlist-modify-public",
      ],
      redirectUri,
    },
    discovery
  );

  async function authenticate() {
    await promptAsync();
  }

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;

      const fetchToken = async () => {
        const details: { [key: string]: any } = {
          grant_type: "authorization_code",
          code: code,
          redirect_uri: redirectUri,
          client_id: clientId,
          client_secret: "YOUR_SPOTIFY_CLIENT_SECRET",
        };

        const formBody = Object.keys(details)
          .map(
            (key) =>
              encodeURIComponent(key) + "=" + encodeURIComponent(details[key])
          )
          .join("&");

        const response = await fetch(discovery.tokenEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formBody,
        });

        const data = await response.json();
        console.log(data);
      };

      fetchToken();
    }
  }, [response]);

  return (
    <LinearGradient colors={["#040306", "#131624"]} className="flex-1">
      <SafeAreaView>
        <View className=" h-[80px]" />
        <Entypo
          style={{ textAlign: "center" }}
          name="spotify"
          size={80}
          color={"white"}
        />
        <Text className=" text-white text-center font-bold text-[40px] ">
          Millions of Songs free on Spotify
        </Text>

        <View className="h-[80px]" />
        <Pressable
          onPress={authenticate}
          className="bg-[#1db954] p-[10px] mx-auto w-[300px] rounded-[25px] items-center "
        >
          <Text>Sign in with spotify</Text>
        </Pressable>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Login;
