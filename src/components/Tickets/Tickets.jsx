import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import JsBarcode from 'jsbarcode';

import map from './map.svg';
import loadingGIF from './loading.svg';

import kazakhstan from './citizenship/kazakhstan';
import russia from './citizenship/russia';
// import ukraine from './citizenship/ukraine';
// import uzbekistan from './citizenship/uzbekistan';
// import kyrgyzstan from './citizenship/kirgizstan';

const KIWIAPI = `https://kiwicom-prod.apigee.net/v2/nomad`;

const Wrap = styled.div`
  min-width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgb(245,245,245);
  font-family: sans-serif;
`;

const Content = styled.div`
  width: 100vw;
  min-height: 100vh;
  background: linear-gradient(rgba(245,245,245,.9), rgba(245,245,245,.9)), url(${map});
  background-size: cover;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
`;

const Flight = styled.div`
  padding-top: 30px;
  padding-bottom: 30px;
  width: 100%;
  height: 100%;
`;

const Ticket = styled.div`
  width: 60vw;
  height: 350px;
  border-radius: 14px;
  background: white;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
  margin-left: 20vw;
  box-shadow: 1px 1px 10px rgba(0,0,0,0.1);
`;

const TickerLeft = styled.div`
  width: 42vw;
  height: 100%;
`;

const TickerRight = styled.div`
  width: 18vw;
  height: 100%;
  border-left: dotted 1px rgba(0,0,0,0.1);
`;

const TopBarLeft = styled.div`
  width: 100%;
  height: 80px;
  background: #FFA000;
  border-top-left-radius: 14px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const LeftPad = styled.div`
  display: column;
`;

const TopBarLeftH1 = styled.h1`
  padding: 0;
  margin: 0;
  padding-left: 20px;
`;

const Undertext = styled.span`
  color: black;
  font-size: 10pt;
  padding: 0;
  margin: 0;
  padding-left: 20px;
`;

const TopBarRight = styled.div`
  width: 100%;
  height: 80px;
  background: #FFA000;
  border-top-right-radius: 14px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const TopBarRightH2 = styled.h2`
  padding: 0;
  margin: 0;
  padding-right: 40px;
`;

const Barcode = styled.img`
  -webkit-transform:rotate(90deg);
  -moz-transform: rotate(90deg);
  -ms-transform: rotate(90deg);
  -o-transform: rotate(90deg);
  transform: rotate(90deg);
  margin-left: 35px;
  margin-top: 90px;
  height: 80px;
  width: 200px;
`;

const BarcodeHorizontal = styled.img`
  width: 17vw;
  margin-left: 0.5vw;
  height: 70px;
`;

const Button = styled.div`
  width: 8vw;
  margin-left: 5vw;
  height: 50px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: #5ABD45;
  box-shadow: 1px 1px 3px rgba(0,0,0,0.3);
  color: white;
  margin-bottom: 5px;
  cursor: pointer;

  &:hover {
    background: #51AA3E;
  }
`;

const MiddleBarLeft = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const FromTo = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: -40px;

  & h2 {
    margin: 0;
    padding: 0;
    padding-bottom: 15px;
  }
`;

const Row = styled.div`
  height: 270px;
  display: flex;
  flex-direction: row;
  margin-left: -70px;
`;

const Inrow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const Loading = styled.img`
  width: 300px;
  height: 230px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -150px;
  margin-top: -115px;
`;

const A = styled.a`
  color: white;
  text-decoration: none;
`;

const Small = styled.small`
  margin-left: 5px;
  color: grey;
`;

const OverNight = styled.span`
  color: red;
  fontSize: 8pt;
  marginTop: 8px;
  position: absolute;
`;

const H3NoSpace = styled.h3`
  margin: 0;
  padding: 0;
`;

const formatDate = (input) => {
  let date = new Date(input);
  let values = [ date.getDate(), date.getMonth() + 1 ];
  for( var id in values ) {
    values[ id ] = values[ id ].toString().replace( /^([0-9])$/, '0$1' );
  }
  return `${values[0]}.${values[1]}.${date.getFullYear()}`;
}

const isNextDay = (from, to) => {
  let fromDate = new Date(from);
  let toDate = new Date(to);
  console.log(toDate.getDate());
  console.log(fromDate.getDate());
  if(fromDate.getDate() < toDate.getDate()) return toDate.getDate() - fromDate.getDate();
  return 0;
}

const formTicket = (data) => {
  return(
    <Ticket>
      <TickerLeft>
        <TopBarLeft>
          <LeftPad>
            <TopBarLeftH1>
              Boarding Pass
            </TopBarLeftH1>
            <Undertext>
              { data.route[0].cityFrom } ({ data.route[0].flyFrom }) – { data.route[1].cityFrom } ({ data.route[1].flyFrom })
            </Undertext>
          </LeftPad>
          <TopBarRightH2>
            economy
          </TopBarRightH2>
        </TopBarLeft>
        <Row>
          <Barcode id='barcode' />
          <MiddleBarLeft>
            <FromTo>
              <Inrow>
                <h3>
                  { data.route[0].cityFrom } ({ data.route[0].flyFrom }) – { data.route[0].cityTo } ({ data.route[0].flyTo })
                </h3>
                <Small>
                  { formatDate(data.route[0].local_departure) }
                  { isNextDay(data.route[0].local_departure, data.route[0].local_arrival) > 0 && <OverNight>
                    +{isNextDay(data.route[0].local_departure, data.route[0].local_arrival)} day
                  </OverNight> }
                  <br />
                  { formatDate(data.route[0].local_arrival) }
                </Small>
              </Inrow>
              <Inrow>
                <h3>
                  { data.route[1].cityFrom } ({ data.route[1].flyFrom }) – { data.route[1].cityTo } ({ data.route[1].flyTo })
                </h3>
                <Small>
                  { formatDate(data.route[1].local_departure) }
                  { isNextDay(data.route[1].local_departure, data.route[1].local_arrival) > 0 && <OverNight> 
                    +{isNextDay(data.route[1].local_departure, data.route[1].local_arrival)} day
                  </OverNight> }
                  <br />
                  { formatDate(data.route[1].local_arrival) }
                </Small>
              </Inrow>
              <H3NoSpace>
                Duration: { Number.parseInt( data.duration / 60 / 60) } hours
              </H3NoSpace>
              <H3NoSpace>
                Price: ${ data.price }
              </H3NoSpace>
            </FromTo>
          </MiddleBarLeft>
        </Row>
      </TickerLeft>
      <TickerRight>
        <TopBarRight>
          <LeftPad>
            <TopBarLeftH1>
              Boarding Pass
            </TopBarLeftH1>
            <Undertext>
              economy
            </Undertext>
          </LeftPad>
        </TopBarRight>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <A href={ data.deep_link } target="_blank">
          <Button>
            Buy
          </Button>
        </A>
        <BarcodeHorizontal id='barcode' />
      </TickerRight>
    </Ticket>
  );
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const prepareDate = (date, cb) => {
  cb(date.replace(/\./g, '%2F'));
};

const formRequest = (to, back, airport, opts) => {
  const currency = opts.currency || 'USD';
  const locale = opts.locale || 'ru';
  const adults = opts.adults || 1;
  return `${KIWIAPI}?adults=${adults}&curr=${currency}&locale=${locale}&
sort=quality&limit=200&date_from=${to}&date_to=${back}&fly_from=${airport}&fly_to=${airport}`;
}

export const Tickets = (props) => {

  const rawToDate      = props.match.params.to;
  const rawBackDate    = props.match.params.back;
  const rawCitizenship = props.match.params.citizenship;
  const rawAirport     = props.match.params.airport;  

  const [citizenship, setCitizenship] = useState(null);
  const [airport, setAirport]         = useState(null);
  const [to, setTo]                   = useState(null);
  const [back, setBack]               = useState(null);
  const [result, setResult]           = useState(null);
  const [loading, setLoading]         = useState(true);
  const [rendered, setRendered]       = useState(false);
  const [amount]                      = useState(0);

  const fetchCountry = (country) => {
    console.log(country);
    switch(country) {
      case 'kz':
        setCitizenship(kazakhstan);
        break;
      case 'ru':
        setCitizenship(russia);
        break;
      default:
        setCitizenship(russia);
        break;
    }
  };

  useEffect(() => {
    prepareDate(rawToDate, setTo);
    prepareDate(rawBackDate, setBack);
    fetchCountry(rawCitizenship);
    setAirport(rawAirport);
  }, []);

  useEffect(() => {
    if(!rendered) return;
    setTimeout(() => {
      setLoading(false);
      setTimeout(() => {
        for(let i = 0; i <= amount; i++) {
          try {
            JsBarcode('#barcode', '1120291741293712', {
              lineColor: '#000000',
              width: 1.5,
              displayValue: false
            });
          } catch(e) {
            console.log(e);
          }
        }
      }, 100);
    }, 100);
  }, [rendered]);

  useEffect(() => {
    if(!citizenship) return;
    const codes = citizenship.countries.map(dest => dest.code);
    const promises = codes.map(code => {
      const codesObjected = [{ "locations": [code], "nights_range": [1,3] }];
      return [delay(50), fetch(formRequest(to, back, airport), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'So9MU5TT4ZgrG6QDhDejAvElgppVYTWq'
        },
        body: JSON.stringify({ "via": codesObjected })
      })];
    });
    const flights = [];
    promises.map(pack => {
      return Promise.all(pack).then(responses => {
        const response = responses[1];
        response.json().then(data => {
          console.log(data);
          if(data.data.length === 0) return;
          flights.push(formTicket(data.data[0]));
        });
      });
    });
    setTimeout(() => {
      setResult(flights);
      setTimeout(() => {
        setRendered(true);
      }, 100);
    }, 1000 * (promises.length + 10));
  }, [citizenship]);

  return (
    <Wrap>
      { loading && <Content>
        <Loading src={loadingGIF} />
      </Content> }
      <Flight>
        { result && result }
      </Flight>
    </Wrap>
  );
};
