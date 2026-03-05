import {useEffect} from 'react';
import BackgroundGeolocation from "react-native-background-geolocation";
import {useAppDispatch} from '@/state/store';
import {setUserLocation} from '@/state/navSlice';

export default function useBackgroundGeolocation() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        BackgroundGeolocation.onLocation((location) => {
            dispatch(setUserLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                accuracy: location.coords.accuracy,
                heading: location.coords.heading,
                speed: location.coords.speed,
            }));
        }, (error) => {
            console.log("[location] ERROR: ", error);
        });

        BackgroundGeolocation.ready({
            logger: {
                debug: true,
                logLevel: BackgroundGeolocation.LogLevel.Verbose
            },
            geolocation: {

                activityType: BackgroundGeolocation.ActivityType.AutomotiveNavigation,
                desiredAccuracy: BackgroundGeolocation.DesiredAccuracy.High,
                distanceFilter: 10,
                stopTimeout: 5,
                disableElasticity: false,
                pausesLocationUpdatesAutomatically: false,
            },
            http: {
                autoSync: true,
            },
            app: {
                heartbeatInterval: 60,
                stopOnTerminate: false,
                startOnBoot: true,
                notification: {
                    title: "NovaRush Active",
                    text: "Your location is used for your NovaRush App!",
                    color: "#4361EE",
                    smallIcon: "mipmap/ic_launcher",

                    // Opțional în v5:
                    layout: "notification_layout",
                    channelName: "NovaRush Tracking Channel"
                }
            },

        }).then((state) => {
            if (!state.enabled) {
                BackgroundGeolocation.start().then();
            }
        });

        return () => {
            BackgroundGeolocation.removeListeners().then();
        };
    }, [dispatch]);
};
