
const ChipBodyCondition = ({ bodyRanges, measure, state }: { bodyRanges: number[]; measure?: number; state?: string }) => {

    const minRange = Number(bodyRanges[0])
    const maxRange = Number(bodyRanges[1])
    const ideal = Number(measure) >= minRange && Number(measure) <= maxRange
    const fat = Number(measure) > maxRange
    const skinny = Number(measure) < minRange

    if (state == 'death') return <div>
        <p className='chip chip_red'>Muerta</p>
    </div>

    if (!bodyRanges || !measure) return <div>
        <p className='chip chip_gray'>Sin mediciones</p>
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