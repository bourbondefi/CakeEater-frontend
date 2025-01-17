import React, {useMemo} from 'react';
import Page from '../../components/Page';
import {createGlobalStyle} from 'styled-components';
import CountUp from 'react-countup';
import CardIcon from '../../components/CardIcon';
import TokenSymbol from '../../components/TokenSymbol';
import useBombStats from '../../hooks/useBombStats';
import useLpStats from '../../hooks/useLpStats';
import useLpStatsBTC from '../../hooks/useLpStatsBTC';
import useModal from '../../hooks/useModal';
import useZap from '../../hooks/useZap';
import useBondStats from '../../hooks/useBondStats';
import usebShareStats from '../../hooks/usebShareStats';
import useTotalValueLocked from '../../hooks/useTotalValueLocked';
import {Bomb as bombTesting} from '../../bomb-finance/deployments/deployments.testing.json';
import {Bomb as bombProd} from '../../bomb-finance/deployments/deployments.mainnet.json';
import {roundAndFormatNumber} from '../../0x';
import MetamaskFox from '../../assets/img/metamask-fox.svg';
import {Box, Button, Card, CardContent, Grid, Paper} from '@material-ui/core';
import ZapModal from '../Bank/components/ZapModal';
import {Alert} from '@material-ui/lab';
import useCashPriceInLastTWAP from '../../hooks/useCashPriceInLastTWAP';
import {makeStyles} from '@material-ui/core/styles';
import useBombFinance from '../../hooks/useBombFinance';
import {ReactComponent as IconTelegram} from '../../assets/img/telegram.svg';
import {Helmet} from 'react-helmet';
import BombImage from '../../assets/img/bomb.png';

import HomeImage from '../../assets/img/background.jpg';
const BackgroundImage = createGlobalStyle`
  body {
    background: url(${HomeImage}) repeat !important;
    background-size: cover !important;
    background-color: #171923;
  }
`;
const TITLE = 'BourbonDeFi';

// const BackgroundImage = createGlobalStyle`
//   body {
//     background-color: grey;
//     background-size: cover !important;
//   }
// `;

const useStyles = makeStyles((theme) => ({
  button: {
    [theme.breakpoints.down('415')]: {
      // marginTop: '10px'
    },
  },
}));

const Home = () => {
  const classes = useStyles();
  const TVL = useTotalValueLocked();
  const bombFtmLpStats = useLpStatsBTC('BOURBONCAKE-CAKE-LP');
  const bShareFtmLpStats = useLpStats('BSHARE-BNB-LP');
  const bombStats = useBombStats();
  const bShareStats = usebShareStats();
  const tBondStats = useBondStats();
  const bombFinance = useBombFinance();
  const cashPrice = useCashPriceInLastTWAP();

  let bomb;
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    bomb = bombTesting;
  } else {
    bomb = bombProd;
  }

  const buyBombAddress =
      'https://pancakeswap.finance/swap?inputCurrency=0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82&outputCurrency=' + bomb.address;
  //  'https://app.bogged.finance/bsc/swap?tokenIn=0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c&tokenOut=' 
  //https://pancakeswap.finance/swap?outputCurrency=0x37c3205E81D44770d6b9E5693094264C6aA4d6E1';
  const buyBShareAddress =
    'https://pancakeswap.finance/swap?outputCurrency=0x37c3205E81D44770d6b9E5693094264C6aA4d6E1';
  const bombLPStats = useMemo(() => (bombFtmLpStats ? bombFtmLpStats : null), [bombFtmLpStats]);
  const bshareLPStats = useMemo(() => (bShareFtmLpStats ? bShareFtmLpStats : null), [bShareFtmLpStats]);
  const bondScale = (Number(cashPrice) / 1000000000000000000).toFixed(4); 
  const bombPriceInDollars = useMemo(
    () => (bombStats ? Number(bombStats.priceInDollars).toFixed(2) : null),
    [bombStats],
  );
  const bombPriceInBNB = useMemo(() => (bombStats ? Number(bombStats.tokenInFtm).toFixed(2) : null), [bombStats]);
  const bombCirculatingSupply = useMemo(() => (bombStats ? String(bombStats.circulatingSupply) : null), [bombStats]);
  const bombTotalSupply = useMemo(() => (bombStats ? String(bombStats.totalSupply) : null), [bombStats]);

  const bSharePriceInDollars = useMemo(
    () => (bShareStats ? Number(bShareStats.priceInDollars).toFixed(2) : null),
    [bShareStats],
  );
  const bSharePriceInBNB = useMemo(
    () => (bShareStats ? Number(bShareStats.tokenInFtm).toFixed(4) : null),
    [bShareStats],
  );
  const bShareCirculatingSupply = useMemo(
    () => (bShareStats ? String(bShareStats.circulatingSupply) : null),
    [bShareStats],
  );
  const bShareTotalSupply = useMemo(() => (bShareStats ? String(bShareStats.totalSupply) : null), [bShareStats]);

  const tBondPriceInDollars = useMemo(
    () => (tBondStats ? Number(tBondStats.priceInDollars).toFixed(2) : null),
    [tBondStats],
  );
  const tBondPriceInBNB = useMemo(() => (tBondStats ? Number(tBondStats.tokenInFtm).toFixed(4) : null), [tBondStats]);
  const tBondCirculatingSupply = useMemo(
    () => (tBondStats ? String(tBondStats.circulatingSupply) : null),
    [tBondStats],
  );
  const tBondTotalSupply = useMemo(() => (tBondStats ? String(tBondStats.totalSupply) : null), [tBondStats]);

  const bombLpZap = useZap({depositTokenName: 'BOURBONCAKE-CAKE-LP'});
  const bshareLpZap = useZap({depositTokenName: 'BSHARE-BNB-LP'});

  const [onPresentBombZap, onDissmissBombZap] = useModal(
    <ZapModal
      decimals={18}
      onConfirm={(zappingToken, tokenName, amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        bombLpZap.onZap(zappingToken, tokenName, amount);
        onDissmissBombZap();
      }}
      tokenName={'BOURBONCAKE-CAKE-LP'}
    />,
  );

  const [onPresentBshareZap, onDissmissBshareZap] = useModal(
    <ZapModal
      decimals={18}
      onConfirm={(zappingToken, tokenName, amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        bshareLpZap.onZap(zappingToken, tokenName, amount);
        onDissmissBshareZap();
      }}
      tokenName={'BSHARE-BNB-LP'}
    />,
  );

  return (
    <Page>
      <Helmet>
        <title>{TITLE}</title>
      </Helmet>
      <BackgroundImage />
      <Grid container spacing={3}>
        {/* Logo */}
        <Grid
          item
          xs={12}
          sm={4}
          style={{display: 'flex', justifyContent: 'center', verticalAlign: 'middle', overflow: 'hidden'}}
        >
          <img src={BombImage} alt="BourbonDefi" style={{maxHeight: '240px'}} />
        </Grid>
        {/* Explanation text */}
        <Grid item xs={12} sm={8}>
          <Paper>
            <Box p={4} style={{textAlign: 'center'}}>
              <h2>Welcome to Bourbon Cake</h2>
              <p>
                Bourbon Cake is an algocoin which is designed to follow the price of CAKE. Enjoy high yields normally only found
                on high risk assets, but with exposure to CAKE instead!
              </p>
              <p>
                <strong>Bourbon Cake is pegged via algorithm to a 1:1 ratio to CAKE.</strong>
                {/* Stake your BOURBONCAKE-CAKE LP in the Farm to earn BSHARE rewards. Then stake your earned BSHARE in the
                Boardroom to earn more BOURBONCAKE! */}
              </p>
              <p>
                <IconTelegram alt="telegram" style={{fill: '#dddfee', height: '15px'}} /> Join our{' '}
                <a
                  href="https://t.me/bourbondao"
                  rel="noopener noreferrer"
                  target="_blank"
                  style={{color: '#dddfee'}}
                >
                  Telegram
                </a>{' '}
                to find out more!
              </p>
            </Box>
          </Paper>
        </Grid>

       {/* <Grid container spacing={3}>
          <Grid item xs={12} sm={12} justify="center" style={{margin: '12px', display: 'flex'}}>
            <Alert variant="filled" severity="info">
              <h2>BOURBONCAKE STAKING IS LIVE!</h2>
              <h4>
                Get your xBOMB now by staking BOURBONCAKE.{' '}
                <Button href="/xbomb" className="shinyButton" style={{margin: '10px'}}>
                  Get xBOMB
                </Button>
              </h4>
            </Alert>
          </Grid>
        </Grid> */}

        {/* TVL */}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent align="center">
              <h2>Total Value Locked</h2>
              <CountUp style={{fontSize: '25px'}} end={TVL} separator="," prefix="$" />
            </CardContent>
          </Card>
        </Grid>

        {/* Wallet */}
        <Grid item xs={12} sm={8}>
          <Card style={{height: '100%'}}>
            <CardContent align="center" style={{marginTop: '2.5%'}}>
              {/* <h2 style={{ marginBottom: '20px' }}>Wallet Balance</h2> */}
              <Button href="/boardroom" className="shinyButton" style={{margin: '10px'}}>
                Stake Now
              </Button>
              <Button href="/farm" className="shinyButton" style={{margin: '10px'}}>
                Farm Now
              </Button>
              <Button
                target="_blank"
                href={buyBombAddress}
                style={{margin: '10px'}}
                className={'shinyButton ' + classes.button}
              >
                Buy BOURBON CAKE
              </Button>
              <Button
                target="_blank"
                href={buyBShareAddress}
                className={'shinyButton ' + classes.button}
                style={{marginLeft: '10px'}}
              >
                Buy BSHARE
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* BOURBONCAKE */}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent align="center" style={{position: 'relative'}}>
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="BOURBONCAKE" />
                </CardIcon>
              </Box>
              <Button
                onClick={() => {
                  bombFinance.watchAssetInMetamask('BOURBONCAKE');
                }}
                style={{position: 'absolute', top: '10px', right: '10px', border: '1px grey solid'}}
              >
                {' '}
                <b>+</b>&nbsp;&nbsp;
                <img alt="metamask fox" style={{width: '20px', filter: 'grayscale(100%)'}} src={MetamaskFox} />
              </Button>
              <h2 style={{marginBottom: '10px'}}>BOURBON CAKE</h2>
              1 Bourbon Cake (1.0 Peg) =
              <Box>
                <span style={{fontSize: '30px', color: 'white'}}>{bombPriceInBNB ? bombPriceInBNB : '--.--'} CAKE</span>
              </Box>
              <Box>
                <span style={{fontSize: '16px', alignContent: 'flex-start'}}>
                  ${bombPriceInDollars ? roundAndFormatNumber(bombPriceInDollars, 2) : '-.--'} / BOURBON CAKE
                </span>
              </Box>
              <span style={{fontSize: '12px'}}>
                Market Cap: ${roundAndFormatNumber(bombCirculatingSupply * bombPriceInDollars, 2)} <br />
                Circulating Supply: {roundAndFormatNumber(bombCirculatingSupply, 2)} <br />
                Total Supply: {roundAndFormatNumber(bombTotalSupply, 2)}
              </span>
            </CardContent>
          </Card>
        </Grid>

        {/* BSHARE */}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent align="center" style={{position: 'relative'}}>
              <Button
                onClick={() => {
                  bombFinance.watchAssetInMetamask('BSHARE');
                }}
                style={{position: 'absolute', top: '10px', right: '10px', border: '1px grey solid'}}
              >
                {' '}
                <b>+</b>&nbsp;&nbsp;
                <img alt="metamask fox" style={{width: '20px', filter: 'grayscale(100%)'}} src={MetamaskFox} />
              </Button>
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="BSHARE" />
                </CardIcon>
              </Box>
              <h2 style={{marginBottom: '10px'}}>BSHARE</h2>
              Current Price
              <Box>
                <span style={{fontSize: '30px', color: 'white'}}>
                  {bSharePriceInBNB ? bSharePriceInBNB : '-.----'} BNB
                </span>
              </Box>
              <Box>
                <span style={{fontSize: '16px'}}>${bSharePriceInDollars ? bSharePriceInDollars : '-.--'} / BSHARE</span>
              </Box>
              <span style={{fontSize: '12px'}}>
                Market Cap: ${roundAndFormatNumber((bShareCirculatingSupply * bSharePriceInDollars).toFixed(2), 2)}{' '}
                <br />
                Circulating Supply: {roundAndFormatNumber(bShareCirculatingSupply, 2)} <br />
                Total Supply: {roundAndFormatNumber(bShareTotalSupply, 2)}
              </span>
            </CardContent>
          </Card>
        </Grid>

        {/* BBOND */}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent align="center" style={{position: 'relative'}}>
              <Button
                onClick={() => {
                  bombFinance.watchAssetInMetamask('BBOND');
                }}
                style={{position: 'absolute', top: '10px', right: '10px', border: '1px grey solid'}}
              >
                {' '}
                <b>+</b>&nbsp;&nbsp;
                <img alt="metamask fox" style={{width: '20px', filter: 'grayscale(100%)'}} src={MetamaskFox} />
              </Button>
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="BBOND" />
                </CardIcon>
              </Box>
              <h2 style={{marginBottom: '10px'}}>BBOND</h2>
              1 BBOND
              <Box>
                <span style={{fontSize: '30px', color: 'white'}}>
                  {bondScale ? bondScale : '-.----'} CAKE
                </span>
              </Box>
              <Box>
                <span style={{fontSize: '16px'}}>${bondScale ? bondScale : '-.--'} / BBOND</span>
              </Box>
              <span style={{fontSize: '12px'}}>
                Market Cap: ${roundAndFormatNumber((tBondCirculatingSupply * tBondPriceInDollars).toFixed(2), 2)} <br />
                Circulating Supply: {roundAndFormatNumber(tBondCirculatingSupply, 2)} <br />
                Total Supply: {roundAndFormatNumber(tBondTotalSupply, 2)}
              </span>
            </CardContent>
          </Card>
        </Grid>
      {/*  <Grid item xs={12} sm={6}>
          <Card>
            <CardContent align="center">
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="BOURBONCAKE-CAKE-LP" />
                </CardIcon>
              </Box>
              <h2>BOURBONCAKE-CAKE PancakeSwap LP</h2>
              <Box mt={2}>
                <Button disabled onClick={onPresentBombZap} className="shinyButtonDisabledSecondary">
                  Zap In
                </Button>
              </Box>
              <Box mt={2}>
                <span style={{fontSize: '26px'}}>
                  {bombLPStats?.tokenAmount ? bombLPStats?.tokenAmount : '-.--'} BOURBONCAKE /{' '}
                  {bombLPStats?.ftmAmount ? bombLPStats?.ftmAmount : '-.--'} CAKE
                </span>
              </Box>
              <Box>${bombLPStats?.priceOfOne ? bombLPStats.priceOfOne : '-.--'}</Box>
              <span style={{fontSize: '12px'}}>
                Liquidity: ${bombLPStats?.totalLiquidity ? roundAndFormatNumber(bombLPStats.totalLiquidity, 2) : '-.--'}{' '}
                <br />
                Total Supply: {bombLPStats?.totalSupply ? roundAndFormatNumber(bombLPStats.totalSupply, 2) : '-.--'}
              </span>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent align="center">
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="BSHARE-BNB-LP" />
                </CardIcon>
              </Box>
              <h2>BSHARE-BNB PancakeSwap LP</h2>
              <Box mt={2}>
                <Button onClick={onPresentBshareZap} className="shinyButtonSecondary">
                  Zap In
                </Button>
              </Box>
              <Box mt={2}>
                <span style={{fontSize: '26px'}}>
                  {bshareLPStats?.tokenAmount ? bshareLPStats?.tokenAmount : '-.--'} BSHARE /{' '}
                  {bshareLPStats?.ftmAmount ? bshareLPStats?.ftmAmount : '-.--'} BNB
                </span>
              </Box>
              <Box>${bshareLPStats?.priceOfOne ? bshareLPStats.priceOfOne : '-.--'}</Box>
              <span style={{fontSize: '12px'}}>
                Liquidity: $
                {bshareLPStats?.totalLiquidity ? roundAndFormatNumber(bshareLPStats.totalLiquidity, 2) : '-.--'}
                <br />
                Total Supply: {bshareLPStats?.totalSupply ? roundAndFormatNumber(bshareLPStats.totalSupply, 2) : '-.--'}
              </span>
            </CardContent>
          </Card>
        </Grid> */}
      </Grid> 
    </Page>
  );
};

export default Home;
