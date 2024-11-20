
const ChipBodyCondition = ({ bodyRanges = [0, 0], measure }: { bodyRanges: number[]; measure?: number; }) => {

    const minRange = Number(bodyRanges[0])
    const maxRange = Number(bodyRanges[1])
    const ideal = Number(measure) >= minRange && Number(measure) <= maxRange
    const fat = Number(measure) > maxRange
    const skinny = Number(measure) < minRange

    if (!bodyRanges || !measure) return <p className='chip chip_gray'>Sin mediciones</p>


    if (fat) return <p className='chip chip_orange'>Gorda {`(${measure})`}</p>


    if (skinny) return <p className='chip chip_yellow'>Flaca {`(${measure})`}</p>


    if (ideal) return <p className='chip chip_green'>Ideal {`(${measure})`}</p>


}

export default ChipBodyCondition