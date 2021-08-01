import { NextPage } from 'next'
import Layout from '../components/Layout'

const Board2: NextPage = () => {
  return (
    <Layout>
      <div className="cal-wrapper">
        <div className="cal-header"></div>
        <div className="cal-body">
          <div className="cal-items-wrapper scrollbar">
            {[1, 2, 3, 4, 5, 6].map((v) => (
              <div className="cal-items" key={`cal-items-${v}`}>
                <div className="cal-items-inner">
                  {v == 2 &&
                    [1, 2, 3, 4, 5].map((vv) => (
                      <div key={`cal-item-2-${v}-${vv}`} className="cal-item">
                        a
                      </div>
                    ))}
                  {v !== 2 &&
                    [1, 2].map((vv) => (
                      <div key={`cal-oitem-2-${v}-${vv}`} className="cal-item">
                        a
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Board2
