import { ModalName } from "../components/Today/TodayHightLight.vue";
import gsap from 'gsap'

export const mountModalHander = (id: ModalName, gsapTLref: GSAPTimeline, isResize: boolean, modalID: '#modal-today-hr' | '#forcast-today-hr' | '#modal-moon' = '#modal-today-hr') => {


    let element: HTMLElement | null = null

    switch (id) {
        case 'uv':
            element = document.getElementById('uv-placeholder')
            break;
        case 'rain':
            element = document.getElementById('rain-placeholder')
            break;
        case 'humidity':
            element = document.getElementById('humidity-placeholder')
            break;
        case 'cloud':
            element = document.getElementById('cloud-placeholder')
            break;
        case 'weatherCard':
            element = document.getElementById('weatherCard-placeholder')
            break;
        case 'air':
            element = document.getElementById('air-placeholder')
            break;
        case 'moon':
            element = document.getElementById('moon-placeholder')
            break;
    }


    if (gsapTLref.isActive() || !element) return



    const { x, y, width, height } = element.parentElement?.getBoundingClientRect() as DOMRect
    const remValue = parseFloat(getComputedStyle(document.documentElement).fontSize)


    if (!gsapTLref.reversed() && !gsapTLref.paused()) {
        if (isResize) {
            gsap.to(
                `#${id}-placeholder`,
                {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "transparent",
                    opacity: 0,
                    zIndex: 10,
                    duration: 0.2,
                    borderRadius: "0.75rem",
                }
            )
            gsap.to(
                `${modalID}`, {
                display: "none",
                transform: "translateY(-50%) translateX(-50%)",
                opacity: 0,
                duration: 0,
            })
            gsapTLref.reverse()
            return false
        }
        gsapTLref.reverse()
        return false
    }

    gsapTLref.clear()
    const idE = `#${id}-placeholder`
    gsapTLref.
        to(idE, {
            position: "fixed",
            top: `${y / remValue}rem`,
            left: `${x / remValue}rem`,
            width: `${width / remValue}rem`,
            cursor: "default",
            height: `${height / remValue}rem`,
            duration: 0,
            opacity: 0,
            zIndex: 1000,
        }, '<')
        .to(idE, {
            backgroundColor: "rgba(0,0,0,0.9)",
            duration: 0.4,
            opacity: 0.8,
        }, '>')
        .to(idE, {
            top: 0,
            left: 0,
            width: "100vw",
            opacity: 1,
            height: "100vh",
            borderRadius: "0",
            duration: 0.5,
            animation: "power2.inOut",
        }, '>')
        .fromTo(`${modalID}`, {
            duration: 0.4,
            display: "none",
            opacity: 0,
            visibility: "hidden",
            y: -50,
        }, {
            opacity: 1,
            display: "flex",
            duration: 0.3,
            visibility: "visible",
            pointerEvents: 'auto',
            animation: "power2.inOut",
            y: 0,
        }, '>')

    gsapTLref.play()

}


export const returnModalType = (modalMounted: string, dataAir: number[], dataRainChance: number[], dataCloud: number[], dataHumidity: number[], dataAirIndex: number[]) => {

    switch (modalMounted) {
        case 'uv':
            return {
                dataHr: dataAir.slice(0, 24),
                unit: '',
                headerName: 'UV Index Today',
            }
        case 'rain':
            return {
                dataHr: dataRainChance.slice(0, 24),
                unit: '%',
                headerName: 'Rain Chance Today',
            }
        case 'cloud':
            return {
                dataHr: dataCloud.slice(0, 24),
                unit: '%',
                headerName: 'Cloud Cover Today',
            }
        case 'humidity':
            return {
                dataHr: dataHumidity.slice(0, 24),
                unit: '%',
                headerName: 'Humidity Today',
            }
        case 'air':
            return {
                dataHr: dataAirIndex.slice(0, 24),
                unit: '',
                headerName: 'Air Index Today',
            }
        default:
            return {
                dataHr: [],
                unit: '',
                headerName: 'UV Index Today',
            }
    }

}