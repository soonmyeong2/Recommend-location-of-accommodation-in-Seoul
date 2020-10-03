#!/usr/bin/env python
# coding: utf-8

# In[1]:


import findspark
findspark.init()
from pyspark import SparkContext, SparkConf
from pyspark.sql import SQLContext
import os
import numpy as np
import pyspark.sql.functions as f
import subprocess
from pyspark.sql.functions import min, max, col
from pyspark.sql.functions import *


# In[2]:


sc = SparkContext()
sqlcontext = SQLContext(sc)


# In[3]:


dir_in = "/user/hadoop/data/population_raw/local_dong"
args = "hdfs dfs -ls "+dir_in+" | awk '{print $8}'"
proc = subprocess.Popen(args, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)

s_output, s_err = proc.communicate()
all_dart_dirs = s_output.decode('utf-8').split()
print(all_dart_dirs)


# In[4]:


df = sqlcontext.read.format("com.databricks.spark.csv")    .option("header", "true").option("inferSchema", "true").load(all_dart_dirs)


# In[5]:


dong_df = sqlcontext.read.option("header","true").csv("data/cur_dongCode.csv")
dong_df.show()


# In[6]:


import time


# In[11]:


start = time.time()  # 시작 시간 저장
 

#joined = df.join(dong_df, df.행정동코드 == dong_df.행자부행정동코드, how='right')
#joined.show()
 
 
print("time :", time.time() - start) 


# In[8]:


from pyspark.sql.functions import broadcast


# In[10]:


start = time.time()  # 시작 시간 저장

#test = df.join(broadcast(dong_df), df.행정동코드 == dong_df.행자부행정동코드)
#test.show()

print("time :", time.time() - start) 


# In[ ]:





# In[ ]:





# In[ ]:





# In[ ]:




