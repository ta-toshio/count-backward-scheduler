import Layout from '../components/Layout'

const Board3 = () => {
  return (
    <Layout>
      <main className="board-main">
        <div className="board-canvas">
          <div className="board scrollbar">
            {[1, 2, 3, 4, 5, 6].map((x) => (
              <div key={`item-wrapper-${x}`} className="list-wrapper">
                <div className="list">
                  <div className="list-header">{x}月</div>
                  <div className="list-cards scrollbar">
                    <div className="card-section-header">10-01 ~ 10-07</div>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((xx) => (
                      <a
                        key={`item-section-${x}-${xx}`}
                        className="list-card"
                        href="#"
                      >
                        idea
                      </a>
                    ))}
                    <div className="card-section-header">10-08 ~ 10-15</div>
                    {[11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((xx) => (
                      <a
                        key={`item-section-${x}-${xx}`}
                        className="list-card"
                        href="#"
                      >
                        idea
                      </a>
                    ))}
                  </div>
                  <div className="list-footer"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* board-canvas */}
      </main>
    </Layout>
  )
}

export default Board3
