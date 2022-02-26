$(() => {
    $(document).ajaxStart(function () {
        $(".divSpinner").css("display", "inline")
    })
    $(document).ajaxSuccess(function () {
        $(".divSpinner").css("display", "none")
    })


    let checked = []
    let timenow
    let interval

    const drawCoins = (coin) => {
        $(".divCoins").html($(".divCoins").html() + `
            <div class="newCoin">
                <div class="half">
                    <div class="form-check form-switch divSwitch">
                        <input class="form-check-input checkbox checkbox${coin.symbol}" value="${coin.symbol}" type="checkbox" role="switch" id="flexSwitchCheckDefault">
                        <label class="form-check-label" for="flexSwitchCheckDefault"></label>
                    </div>
                    <div class="divP">
                        <p class="symbol">${coin.symbol.toUpperCase()}</p>
                        <p class="name">${coin.name}</p>
                    </div>
                    <button class="btn btn-primary info${coin.id} mi" type="button" >More Info</button>
                </div>
                <div class="card${coin.id} card">
                </div>
                <div class="divSpinnerSmall divSpinnerSmall${coin.id}">
                    <div class="spinner-border spinnerSmall" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            
            </div>`)

    }
    const getInfoOfCoinFirstCond = (coin) => {
        $.get(`https://api.coingecko.com/api/v3/coins/${coin.id}`, (info) => {
            let usdVal = "USD: " + info.market_data.current_price.usd.toLocaleString() + " $"
            let eurVal = "EUR: " + info.market_data.current_price.eur.toLocaleString() + " €"
            let ilsVal = "ILS: " + info.market_data.current_price.ils.toLocaleString() + " ₪"
            let imgVal = info.image.small
            $(`.card${coin.id}`).html(`
                <p class="usdP">${usdVal}</p>
                <p class="eurP">${eurVal}</p>
                <p class="ilsP">${ilsVal}</p>
                <img src="${imgVal}" class="imgCoin" alt="pic" srcset="">
            `)
            localStorage.setItem(`time${coin.id}`, JSON.stringify(timenow))
            localStorage.setItem(`info${coin.id}`, JSON.stringify([usdVal, eurVal, ilsVal, imgVal]))
        })
    }
    const getInfoOfCoin = (coin) => {
        $(`.card${coin.id}`).hide()
        $(`.info${coin.id}`).click(() => {
            timenow = Date.now()
            if (!localStorage.getItem(`info${coin.id}`)) {

                getInfoOfCoinFirstCond(coin)
                $(`.card${coin.id}`).slideToggle()

            } else if (JSON.parse(localStorage.getItem(`time${coin.id}`)) + 120000 > timenow) {

                let moreInfoDateLocal = JSON.parse(localStorage.getItem(`info${coin.id}`))
                $(`.card${coin.id}`).html(`
                <p class="usdP">${moreInfoDateLocal[0]}</p>
                <p class="eurP">${moreInfoDateLocal[1]}</p>
                <p class="ilsP">${moreInfoDateLocal[2]}</p>
                <img src="${moreInfoDateLocal[3]}" class="imgCoin" alt="pic" srcset="">
                `)
                $(`.card${coin.id}`).slideToggle()

            } else {
                if ($(`.card${coin.id}`).css("display") === "none") {
                    localStorage.removeItem(`info${coin.id}`)
                    localStorage.removeItem(`time${coin.id}`)
                    $(`.card${coin.id}`).slideDown()
                    getInfoOfCoinFirstCond(coin)


                } else {
                    localStorage.removeItem(`info${coin.id}`)
                    localStorage.removeItem(`time${coin.id}`)
                    $(`.card${coin.id}`).slideToggle()

                }
            }

        })
    }
    const search = (coins) => {
        let val = $(".searchInput").val().toUpperCase()
        let coinsFiltered = $.grep(coins, (item) => item.name.toUpperCase().includes(val))
        console.log(coinsFiltered)
        $(".divCoins").html(`
        <div class="divSearch"></div>
        `)
        $(".reportsBTN").removeClass("reportsBTNOn")
        $(".allCoinsBTN").removeClass("allCoinsBTNOn")
        $(".about").removeClass("aboutOn")
        for (const coin of coinsFiltered) {
            $(".divSearch").html($(".divSearch").html() + `
            <div class="newCoin">
            <div class="half">
                <div class="form-check form-switch divSwitch">
                    <input class="form-check-input checkbox checkbox${coin.symbol}" value="${coin.symbol}" type="checkbox" role="switch" id="flexSwitchCheckDefault">
                    <label class="form-check-label" for="flexSwitchCheckDefault"></label>
                </div>
                <div class="divP">
                    <p class="symbol">${coin.symbol.toUpperCase()}</p>
                    <p class="name">${coin.name}</p>
                </div>
                <button class="btn btn-primary info${coin.id} mi" type="button" >More Info</button>
            </div>
                <div class="card${coin.id} card">
                </div>
        
            </div>`

            )



        }
        if ($.inArray(val, checked) !== -1) {
            $(`.checkbox${val.toLowerCase()}`).prop('checked', true)
        }
        $(".checkbox").click(() => {
            alerting()
        })
        for (const coin of coinsFiltered) {
            getInfoOfCoin(coin)
        }

        $(".parallax").height($(".divCoins").outerHeight())
    }
    const alerting = () => {
        let checkedboxBig = $("input.checkbox:checkbox:checked").get()
        let item = $(event.currentTarget)[0].defaultValue.toUpperCase()
        if (checkedboxBig.length > 0) {
            if ($.inArray(item, checked) == -1) {
                checked.push(item)
                if (checked.length > 5) {
                    $(".alert").css("display", "block")
                    $(`.checkbox`).prop('disabled', true)
                    $(".cancel").click(() => {
                        $(`.checkbox`).prop('disabled', false)
                        $(".smallCoinsDiv").html("")
                        $(".alert").css("display", "none")
                        if (checked[5]) {

                            $(`.checkbox${checked[checked.length - 1].toLowerCase()}`).prop('checked', false)
                            checked.splice(-1)
                        }
                    })
                    for (const i of checked) {
                        $(".smallCoinsDiv").html($(".smallCoinsDiv").html() + `
                        <div class="newCoinSmall">
                        <div class="form-check form-switch divSwitchSmall">
                            <input class="form-check-input checkboxSmall checkboxSmall${i.toLowerCase()}" type="checkbox" role="switch" id="flexSwitchCheckDefault">
                            <label class="form-check-label" for="flexSwitchCheckDefault"></label>
                        </div>
                        <p class="symbolChecked">${i.toUpperCase()}</p>
                        </div>
                        `)
                    }

                    $(".done").click(() => {
                        let checkedboxSmall = $("input.checkboxSmall:checkbox:checked").get()
                        if (checkedboxSmall.length > 0 && checkedboxSmall.length < 6) {
                            $(`.checkbox`).prop('checked', false)
                            $(".smallCoinsDiv").html("")
                            $(".alert").css("display", "none")
                            $(`.checkbox`).prop('disabled', false)
                            checked = []
                            for (const value of checkedboxSmall) {
                                let valueOfSmall = value.classList[2].substring(13).toUpperCase()
                                checked.push(valueOfSmall)
                                $(`.checkbox${valueOfSmall.toLowerCase()}`).prop('checked', true)

                            }
                        }

                    })

                }

            } else {
                checked = checked.slice().filter((e) => e != item)
            }

        } else {
            checked = checked.slice().filter((e) => e != item)
        }
    }
    const getCoins = () => {
        $.get(`https://api.coingecko.com/api/v3/coins`, (coins) => {
            for (const coin of coins) {
                drawCoins(coin)
            }
            for (const coin of coins) {
                getInfoOfCoin(coin)

            }
            $(".searchInput").keyup(() => {
                search(coins)
            })
            $(".parallax").height($(".divCoins").outerHeight())
            for (const each of checked) {
                $(`.checkbox${each.toLowerCase()}`).prop('checked', true)
            }

            $(".checkbox").click(() => {
                alerting()
            })
        })
        $(".parallax").height($(".divCoins").outerHeight())

    }
    $(".reportsBTN").click(() => {
        if (checked.length == 0) {
            clearInterval(interval)
            alert("Please choose at least one coin to see live reports")
        } else {
            $(".searchInput").hide()
            let options = {
                exportEnabled: true,
                animationEnabled: true,
                title: {
                    text: checked + " To USD"
                },
                subtitles: [{
                    text: "Click Legend to Hide or Unhide Data Series"
                }],
                axisX: {
                    title: "Time"
                },
                axisY:
                {
                    title: "USD Value",
                    titleFontColor: "#4F81BC",
                    lineColor: "#4F81BC",
                    labelFontColor: "#4F81BC",
                    tickColor: "#4F81BC"
                }
                ,

                toolTip: {
                    shared: true
                },
                legend: {
                    cursor: "pointer",
                    itemclick: toggleDataSeries
                },
                data: []

            };

            const intervalF = () => {
                let chart = $("#chartContainer").CanvasJSChart()
                $.get(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${checked}&tsyms=USD`, (v) => {
                    let count = 0
                    for (const value in v) {
                        chart.options.data[count].dataPoints.push({ x: new Date(), y: v[value].USD })

                        count++
                    }
                })
                chart.render()
            }
            interval = setInterval(intervalF, 2000)


            $(".reportsBTN").addClass("reportsBTNOn")
            $(".allCoinsBTN").removeClass("allCoinsBTNOn")
            $(".about").removeClass("aboutOn")
            $(".divCoins").html("")
            $(".parallax").height($(".divCoins").outerHeight())
            $(".divCoins").html(`
                <div class="divReport">
                    <div id="chartContainer" style="height: 370px; width: 100%;"></div>

                </div>`
            )


            $.get(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${checked}&tsyms=USD`, (e) => {
                let chart = $("#chartContainer").CanvasJSChart()
                for (const each in e) {
                    let obj = {
                        type: "spline",
                        name: each,
                        showInLegend: true,
                        xValueFormatString: "HH mm ss",
                        yValueFormatString: "#,##0 Units",
                        dataPoints: [
                            { x: new Date, y: e[each].USD },

                        ]
                    }
                    options.data.push(obj)

                }
                chart.render()
            })
            $("#chartContainer").CanvasJSChart(options)
            function toggleDataSeries(e) {
                if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                    e.dataSeries.visible = false;
                } else {
                    e.dataSeries.visible = true;
                }
                e.chart.render();
            }
        }

    })
    $(".allCoinsBTN").click(() => {
        $(".searchInput").show()

        clearInterval(interval)
        $(".allCoinsBTN").addClass("allCoinsBTNOn")
        $(".reportsBTN").removeClass("reportsBTNOn")
        $(".about").removeClass("aboutOn")
        $(".divSearch").remove()
        $(".divCoins").html("")
        getCoins()

    })
    $(".about").click(() => {
        $(".searchInput").hide()
        $(".about").addClass("aboutOn")
        $(".reportsBTN").removeClass("reportsBTNOn")
        $(".allCoinsBTN").removeClass("allCoinsBTNOn")
        clearInterval(interval)
        $(".divCoins").html("")
        $(".parallax").height($(".divCoins").outerHeight())
        $(".divCoins").html(`
        <div class="me">
        <img src="me.jpeg" alt="pic" class="mePic">
        <p class="eyal">Hi! <br> I'm Eyal Yahav, from Tel Aviv, Israel. <br>
        I take a Full Stack Web Development course, and in this project I want to make the Crypto data currencies accessible for you, using an external API.<br>
         </p>

        </div>`
        )

    })
    $(".crypto").click(() => {
        window.location.reload()
    })
    getCoins()

})