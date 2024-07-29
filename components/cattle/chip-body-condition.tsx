
const ChipBodyCondition = ({ bodyRanges, measure }: { bodyRanges: number[]; measure?: number; }) => {

    const minRange = Number(bodyRanges[0])
    const maxRange = Number(bodyRanges[1])
    const ideal = Number(measure) >= minRange && Number(measure) <= maxRange
    const fat = Number(measure) > maxRange
    const skinny = Number(measure) < minRange

    if (!bodyRanges || !measure) return <div>
        <p className='chip chip_gray'>Datos faltantes</p>
    </div>

    if (fat) return <div>
        <p className='chip chip_orange'>Gorda {`(${measure})`}</p>
    </div>

    if (skinny) return <div>
        <p className='chip chip_yellow'>Flaca {`(${measure})`}</p>
    </div>

    if (ideal) return <div>
        <p className='chip chip_green'>Ideal {`(${measure})`}</p>
    </div>

}

export default ChipBodyCondition